import { useState, useRef } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

import TextInput from "~/components/forms/TextInput";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";

export const AlbumTitleInput = ({
  album,
}: {
  album: { id: string; title: string };
  input?: { styles?: { input?: string } };
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [inputText, setInputText] = useState(album.title);

  const prevTitleValueRef = useRef(album.title);
  const prevTitleValue = prevTitleValueRef.current;
  const isChange = prevTitleValue !== inputText;

  const { refetch: checkTitleIsUnique, data: titleIsUnique } =
    api.album.checkTitleIsUnique.useQuery(
      { title: inputText },
      { enabled: false }
    );

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const updateTitle = api.album.updateTitle.useMutation();

  const handleSubmit = async () => {
    if (!isChange) {
      return;
    }

    const { data: titleIsUnique } = await checkTitleIsUnique();

    if (!titleIsUnique) {
      return;
    }

    updateTitle.mutate(
      { albumId: album.id, updatedTitle: inputText },
      {
        onSuccess: () => {
          prevTitleValueRef.current = inputText;
          toast(<Toast text="Title updated" type="success" />);
          void refetchAlbums();
        },
      }
    );
  };

  const isError = titleIsUnique === false;

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <WithTooltip text="click to edit title" isDisabled={inputIsFocused}>
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        ref={containerRef}
      >
        <div className="form-control w-full max-w-xs">
          <TextInput
            setValue={(value) => setInputText(value)}
            value={inputText}
            placeholder="Album title"
            // inputAdditionalClasses="font-bold text-lg text-black uppercase"
            wrapperAdditionalClasses={`${
              !isError ? "" : "border border-my-error-content"
            }`}
            showPressEnter
            isChange={isChange}
            onBlur={() => setInputIsFocused(false)}
            onFocus={() => setInputIsFocused(true)}
          />
          <label className="label">
            {titleIsUnique === false ? (
              <span className="label-text-alt text-my-error-content">
                Title is already used. Album titles must be unique.
              </span>
            ) : null}
          </label>
        </div>
      </form>
    </WithTooltip>
  );
};
