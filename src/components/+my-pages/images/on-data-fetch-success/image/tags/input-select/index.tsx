import { useState } from "react";
import { type ImageTag } from "@prisma/client";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useImageContext } from "~/components/+my-pages/images/_context";
import { TextInput } from "~/components/ui-compounds";
import { MyToast, WithTooltip } from "~/components/ui-display";
import { arrayDivergence } from "~/helpers/query-data";
import useHovered from "~/hooks/useHovered";
import useIsAdmin from "~/hooks/useIsAdmin";

function InputSelect() {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { isInitialLoading } = api.imageTag.getAll.useQuery();

  return (
    <div className="relative">
      {isInitialLoading ? (
        <p>Loading tags...</p>
      ) : (
        <>
          <Input
            setIsFocused={setInputIsFocused}
            updateValue={setInputValue}
            value={inputValue}
          />
          <Select input={{ isFocused: inputIsFocused, value: inputValue }} />
        </>
      )}
    </div>
  );
}

export default InputSelect;

const inputId = "input-select-combo-input-id";

type InputProps = {
  value: string;
  updateValue: (value: string) => void;
  setIsFocused: (isFocused: boolean) => void;
};

function Input({ setIsFocused, updateValue, value }: InputProps) {
  const { refetch: refetchImages } = api.image.imagesPageGetAll.useQuery(
    undefined,
    { enabled: false },
  );
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery(
    undefined,
    { enabled: false },
  );

  const image = useImageContext();

  const addTagMutation = api.image.addTag.useMutation({
    onSuccess: async () => {
      updateValue("");

      await refetchImages();
      await refetchImageTags();

      toast(<MyToast text="Tag added" type="success" />);
    },
    onError: () => {
      toast(<MyToast text="Something went wrong adding tag" type="error" />);
    },
  });

  const isAdmin = useIsAdmin();

  return (
    <div className="relative inline-block">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!isAdmin) {
            return;
          }

          addTagMutation.mutate({
            data: { text: value },
            where: { imageId: image.id },
          });
        }}
      >
        <div className="relative text-sm">
          <TextInput
            setValue={(value) => updateValue(value)}
            value={value}
            id={inputId}
            placeholder="Add tag..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
};

function Select({ input }: SelectProps) {
  const { data } = api.imageTag.getAll.useQuery(undefined, { enabled: false });
  const allTags = data as NonNullable<ImageTag>[];

  const image = useImageContext();

  const unusedTags = arrayDivergence(allTags, image.tags);

  const [isHovered, { hoverHandlers }] = useHovered();

  const show = isHovered || input.isFocused;

  const { refetch: refetchImages } = api.image.imagesPageGetAll.useQuery(
    undefined,
    { enabled: false },
  );
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery(
    undefined,
    { enabled: false },
  );

  const addTagMutation = api.image.addTag.useMutation({
    onSuccess: async () => {
      await refetchImages();
      await refetchImageTags();

      toast(<MyToast text="Tag added" type="success" />);
    },
    onError: () => {
      toast(<MyToast text="Something went wrong adding tag" type="error" />);
    },
  });

  const isAdmin = useIsAdmin();

  return (
    <div
      className={`absolute -bottom-2 w-full translate-y-full rounded-sm border border-base-200 bg-white text-sm shadow-lg transition-all delay-75 ease-in-out ${
        show
          ? "max-h-[200px] max-w-full overflow-y-auto py-sm px-xs opacity-100 "
          : "max-h-0 max-w-0 overflow-hidden border-0 p-0 opacity-0"
      }`}
      {...hoverHandlers}
    >
      {!allTags.length || !unusedTags.length ? (
        <p className="px-sm text-gray-400">
          {!allTags.length ? "No tags" : "No unused tags"}
        </p>
      ) : (
        <div className="flex flex-col">
          {unusedTags.map((tag) => (
            <WithTooltip
              text="add tag to image"
              type="action"
              placement="auto-start"
              key={tag.id}
            >
              <div
                className={`cursor-pointer rounded-sm py-xxs px-xs hover:bg-base-200 ${
                  !isAdmin ? "cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!isAdmin) {
                    return;
                  }

                  addTagMutation.mutate({
                    data: { text: tag.text },
                    where: { imageId: image.id },
                  });
                }}
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
