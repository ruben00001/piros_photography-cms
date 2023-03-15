import { useState, useRef } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

import TextInput from "~/components/forms/TextInput";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";

export const AlbumTitleInput = ({
  album,
  onSubmit,
}: {
  album: { id: string; title: string };
  // input?: { styles?: { input?: string } };
  onSubmit: (arg0: { title: string; albumId: string }) => void;
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [inputText, setInputText] = useState(album.title);

  const prevTitleValueRef = useRef(album.title);
  const prevTitleValue = prevTitleValueRef.current;
  const isChange = prevTitleValue !== inputText;

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const updateTitle = api.album.updateTitle.useMutation();

  const handleSubmit = () => {
    if (!isChange) {
      return;
    }

    updateTitle.mutate(
      { albumId: album.id, updatedTitle: inputText },
      {
        onSuccess: async () => {
          prevTitleValueRef.current = inputText;

          toast(<Toast text="Title updated" type="success" />);

          await refetchAlbums();
        },
      }
    );
  };

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <WithTooltip text="click to edit title" isDisabled={inputIsFocused}>
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        ref={containerRef}
      >
        <div className="form-control w-full max-w-xs">
          <TextInput
            setValue={(value) => setInputText(value)}
            value={inputText}
            placeholder="Album title"
            showPressEnter
            isChange={isChange}
            onBlur={() => setInputIsFocused(false)}
            onFocus={() => setInputIsFocused(true)}
          />
        </div>
      </form>
    </WithTooltip>
  );
};
