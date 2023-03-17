// type into input; show matches in select pop-up below; press enter to create new if no match;
// press enter to use existing if match; matches are case sensitive; filter matches already used;
// click on match to submit;
// input size - full width;

import { type ImageTag } from "@prisma/client";
import { useState } from "react";

import { arrayDivergence, findEntityById } from "~/helpers/query-data";
import useHovered from "~/hooks/useHovered";
import { api } from "~/utils/api";
import WithTooltip from "~/components/data-display/WithTooltip";
import TextInput from "~/components/forms/TextInput";

type Props = {
  parent: {
    imageTags: ImageTag[];
    addTagTo: (tagId: string) => void;
  };
};

// todo: use zustand more?
// upload image + create in db with tags

function InputSelect({ parent }: Props) {
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
  parent: {
    imageTags: ImageTag[];
    addTagTo: (tagId: string) => void;
  };
  allImageTags: ImageTag[];
};

function Input({ input, parent }: InputProps) {
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery();

  const createImageTag = api.imageTag.create.useMutation({
    onSuccess: ({ id: tagId }) => {
      parent.addTagTo(tagId);

      void refetchImageTags();
    },
  });

  const { refetch: findTagWithText } = api.imageTag.findTagWithText.useQuery(
    { text: input.value },
    { enabled: false }
  );

  const handleSubmit = async () => {
    const matchingTagQuery = await findTagWithText();

    if (matchingTagQuery.data === undefined) {
      // show error in ui
      return;
    }

    if (!matchingTagQuery.data.matchingTag) {
      createImageTag.mutate({ text: input.value });
      return;
    }

    const tagIsRelatedParent = findEntityById(
      parent.imageTags,
      matchingTagQuery.data.matchingTag.id
    );

    if (tagIsRelatedParent) {
      return;
    }

    parent.addTagTo(matchingTagQuery.data.matchingTag.id);
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
          <TextInput
            setValue={(value) => input.updateValue(value)}
            value={input.value}
            id={inputId}
            placeholder="Add tag..."
            onFocus={() => input.setIsFocused(true)}
            onBlur={() => input.setIsFocused(false)}
            showBorderOnBlur
            showPressEnter
          />
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
      className={`absolute -bottom-2 w-full translate-y-full rounded-sm border border-base-200 bg-white py-sm px-xs text-sm shadow-lg transition-all delay-75 ease-in-out ${
        show
          ? "max-h-[200px] max-w-full overflow-y-auto opacity-100"
          : "max-h-0 max-w-0 overflow-hidden  p-0 opacity-0"
      }`}
      {...hoverHandlers}
    >
      {!matches.length ? (
        <p className="px-sm text-gray-400">No matches</p>
      ) : (
        <div className="flex flex-col">
          {matches.map((tag) => (
            <WithTooltip
              text="add tag to image"
              type="action"
              placement="auto-start"
              key={tag.id}
            >
              <div
                className="cursor-pointer rounded-sm py-xxs px-xs hover:bg-base-200"
                onClick={() => parent.addTagTo(tag.id)}
              >
                <div>
                  <p className="text-base-content">{tag.text}</p>
                </div>
              </div>
            </WithTooltip>
          ))}
        </div>
      )}
    </div>
  );
}
