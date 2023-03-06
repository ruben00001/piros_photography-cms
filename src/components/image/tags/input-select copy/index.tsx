// type into input; show matches in select pop-up below; press enter to create new if no match;
// press enter to use existing if match; matches are case sensitive; filter matches already used;
// click on match to submit;
// input size - full width;

import { ImageTag } from "@prisma/client";
import { useState } from "react";
import { arrayDivergence, arrOfObjsIncludesValue } from "~/helpers/data";
import useHovered from "~/hooks/useHovered";
import { api } from "~/utils/api";
import { PlusIcon } from "../../../../Icon";

type Props<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
> = {
  onSubmit: (itemId: string) => void;
  items: {
    relatedData: TItem[];
    // allData: TItem[];
    textKey: TItemTextKey;
  };
  placeholder?: string;
};

function InputSelect<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
>({ items, onSubmit, placeholder }: Props<TItem, TItemTextKey>) {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative">
      <Input
        input={{
          setIsFocused: setInputIsFocused,
          updateValue: setInputValue,
          value: inputValue,
        }}
        items={items}
        onSubmit={onSubmit}
        placeholder={placeholder}
      />
      <Select
        input={{ isFocused: inputIsFocused, value: inputValue }}
        items={items}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default InputSelect;

const inputId = "input-select-combo-input-id";

type InputProps<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
> = {
  onSubmit: (itemId: string) => void;
  input: {
    value: string;
    updateValue: (value: string) => void;
    setIsFocused: (isFocused: boolean) => void;
  };
  placeholder?: string;
  items: {
    relatedData: TItem[];
    // allData: TItem[];
    textKey: TItemTextKey;
  };
};

function Input<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
>({
  input,
  onSubmit,
  placeholder = "Input text",
  items,
}: InputProps<TItem, TItemTextKey>) {
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery();

  const createImageTag = api.imageTag.create.useMutation({
    onSuccess: (onSuccessProps) => {
      console.log("onSuccessProps:", onSuccessProps);

      void refetchImageTags();
    },
  });

  const {
    refetch: checkInputValueIsUnique,
    data: inputValueIsUnique,
    isFetching: isFetchingCheckInputValueIsUnique,
  } = api.imageTag.checkTextIsUnique.useQuery(
    { text: input.value },
    { enabled: false }
  );

  const handleSubmit = async () => {
    const isNewValue = await checkInputValueIsUnique();

    if (isNewValue) {
      createImageTag.mutate({ text: input.value });
    } else {
      const isRelated = arrOfObjsIncludesValue(
        items.relatedData,
        items.textKey as string,
        input.value
      );
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

type SelectProps<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
> = {
  input: {
    value: string;
    isFocused: boolean;
  };
  items: {
    // allData: TItem[];
    relatedData: TItem[];
    textKey: TItemTextKey;
  };
  onSubmit: (itemId: string) => void;
  imageTags: {
    all: ImageTag[];
    related: ImageTag[];
  };
};

function Select<
  TItem extends { id: string } & { [key: string]: string },
  TItemTextKey extends keyof TItem
>({ input, items, onSubmit, imageTags }: SelectProps<TItem, TItemTextKey>) {
  const [isHovered, { hoverHandlers }] = useHovered();

  const show = isHovered || input.isFocused;

  const unrelatedData = arrayDivergence(imageTags.all, imageTags.related);

  const matches = !input.value.length
    ? unrelatedData
    : unrelatedData.filter((item) =>
        item[items.textKey]?.includes(input.value)
      );

  // get matches (don't need fuzzy search don't think)

  return (
    <div
      className={`absolute -bottom-2 w-full translate-y-full rounded-sm border-2 border-gray-200 bg-white py-sm px-sm text-sm shadow-lg transition-all delay-75 ease-in-out ${
        show
          ? "max-h-[400px] max-w-full overflow-y-auto opacity-100"
          : "max-h-0 max-w-0 overflow-hidden  p-0 opacity-0"
      }`}
      {...hoverHandlers}
    >
      {matches.map((item) => (
        <div onClick={() => onSubmit(item.id)} key={item.id}>
          <div>{item[items.textKey]}</div>
        </div>
      ))}
    </div>
  );
}
