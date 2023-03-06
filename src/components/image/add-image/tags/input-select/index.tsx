// type into input; show matches in select pop-up below; press enter to create new if no match;
// press enter to use existing if match; matches are case sensitive; filter matches already used;
// click on match to submit;
// input size - full width;

import { type ImageTag } from "@prisma/client";
import { useState } from "react";
import { arrayDivergence } from "~/helpers/data";

import useHovered from "~/hooks/useHovered";
import { api } from "~/utils/api";
import { PlusIcon } from "~/components/Icon";

type Props = {
  parent: {
    imageTags: ImageTag[];
    addTagTo: (tagId: string) => void;
  };
  placeholder?: string;
};

function InputSelect({ parent, placeholder }: Props) {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: allImageTags } = api.imageTag.getAll.useQuery();

  return (
    <div className="relative">
      {!allImageTags ? (
        <p>Loading tags...</p>
      ) : (
        <>
          <Input
            input={{
              setIsFocused: setInputIsFocused,
              updateValue: setInputValue,
              value: inputValue,
            }}
            allImageTags={allImageTags}
            parent={parent}
            placeholder={placeholder}
          />
          <Select
            input={{ isFocused: inputIsFocused, value: inputValue }}
            parent={parent}
            allImageTags={allImageTags}
          />
        </>
      )}
    </div>
  );
}

export default InputSelect;

const inputId = "input-select-combo-input-id";

type InputProps = {
  input: {
    value: string;
    updateValue: (value: string) => void;
    setIsFocused: (isFocused: boolean) => void;
  };
  placeholder?: string;
  parent: {
    imageTags: ImageTag[];
    addTagTo: (tagId: string) => void;
  };
  allImageTags: ImageTag[];
};

function Input({
  // allImageTags,
  input,
  parent,
  placeholder = "Input text",
}: InputProps) {
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery();

  const createImageTag = api.imageTag.create.useMutation({
    onSuccess: ({ id: tagId }) => {
      parent.addTagTo(tagId);

      void refetchImageTags();
    },
  });

  const {
    refetch: fetchFindTagWithText,
    // data: isTagWithText,
    // isFetching: isFetchingCheckInputValueIsUnique,
  } = api.imageTag.findTagWithText.useQuery(
    { text: input.value },
    { enabled: false }
  );

  const handleSubmit = async () => {
    const matchingTagQuery = await fetchFindTagWithText();

    if (matchingTagQuery.data === undefined) {
      // show error in ui
      return;
    }

    if (!matchingTagQuery.data.matchingTag) {
      createImageTag.mutate({ text: input.value });
    } else {
      parent.addTagTo(matchingTagQuery.data.matchingTag.id);
    }
  };

  return (
    <div className="relative inline-block">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="relative">
          <input
            className="rounded-sm border-2 border-transparent px-lg py-1 text-sm outline-none focus:border-gray-200"
            id={inputId}
            value={input.value}
            onChange={(e) => input.updateValue(e.target.value)}
            placeholder={placeholder}
            type="text"
            autoComplete="off"
            onFocus={() => input.setIsFocused(true)}
            onBlur={() => input.setIsFocused(false)}
          />
          <label
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
            htmlFor={inputId}
          >
            <PlusIcon />
          </label>
        </div>
      </form>
    </div>
  );
}

type SelectProps = {
  input: {
    value: string;
    isFocused: boolean;
  };
  parent: {
    imageTags: ImageTag[];
    addTagTo: (tagId: string) => void;
  };
  allImageTags: ImageTag[];
};

function Select({ input, allImageTags, parent }: SelectProps) {
  const [isHovered, { hoverHandlers }] = useHovered();

  const show = isHovered || input.isFocused;

  const unrelatedData = arrayDivergence(allImageTags, parent.imageTags);

  const matches = !input.value.length
    ? unrelatedData
    : unrelatedData.filter((tag) => tag.text.includes(input.value));

  return (
    <div
      className={`absolute -bottom-2 w-full translate-y-full rounded-sm border-2 border-gray-200 bg-white py-sm px-sm text-sm shadow-lg transition-all delay-75 ease-in-out ${
        show
          ? "max-h-[400px] max-w-full overflow-y-auto opacity-100"
          : "max-h-0 max-w-0 overflow-hidden  p-0 opacity-0"
      }`}
      {...hoverHandlers}
    >
      {!matches.length ? (
        <p>No matches</p>
      ) : (
        matches.map((tag) => (
          <div onClick={() => parent.addTagTo(tag.id)} key={tag.id}>
            <div>{tag.text}</div>
          </div>
        ))
      )}
    </div>
  );
}
