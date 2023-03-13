import { useState, useRef } from "react";

import { AlbumProvider, useAlbumContext } from "~/context/AlbumState";
import { api } from "~/utils/api";
import CoverImage from "~/components/pages/albums/cover-image";
import TextInput from "~/components/forms/TextInput";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import DndSortableElement from "~/components/dnd-kit/DndSortableElement";
import WithTooltip from "~/components/data-display/WithTooltip";
import { Album } from "~/utils/router-output-types";
import AlbumMenu from "./Menu";
import { InfoIcon } from "~/components/Icon";

const Album = ({ album }: { album: Album }) => {
  return (
    <DndSortableElement
      elementId={album.id}
      wrapperClasses="group/album relative rounded-lg border border-transparent p-sm transition-colors duration-75 ease-in-out focus-within:border-base-300 hover:border-base-200"
      key={album.id}
    >
      <AlbumProvider album={album}>
        <AlbumContent />
      </AlbumProvider>
    </DndSortableElement>
  );
};

export default Album;

const AlbumContent = () => {
  return (
    <div>
      <AlbumMenu />
      <AlbumTitleInput />
      <CoverImage />
      <MetaInfo />
    </div>
  );
};

const AlbumTitleInput = () => {
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const album = useAlbumContext();

  const [inputText, setInputText] = useState(album.title);

  const prevTitleValueRef = useRef(album.title);
  const prevTitleValue = prevTitleValueRef.current;
  const isChange = prevTitleValue !== inputText;

  const {
    refetch: checkTitleIsUnique,
    data: titleIsUnique,
    // isFetching: isFetchingCheckTitleIsUnique,
  } = api.album.checkTitleIsUnique.useQuery(
    { title: inputText },
    { enabled: false }
  );

  const { refetch: refetchAlbums } = api.album.getAll.useQuery(undefined, {
    enabled: false,
  });

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
            inputAdditionalClasses="font-bold text-lg text-black uppercase"
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
          {/*         {isFetchingCheckTitleIsUnique ? (
          <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-gray-100 bg-opacity-70">
            <p className="loading">Checking...</p>
          </div>
        ) : null} */}
        </div>
      </form>
    </WithTooltip>
  );
};

const MetaInfo = () => {
  const { published } = useAlbumContext();

  if (published) {
    return null;
  }

  return (
    <div className="mt-md">
      <PublishStatusBadge />
    </div>
  );
};

const PublishStatusBadge = () => {
  const album = useAlbumContext();

  const { refetch: refetchAlbums } = api.album.getAll.useQuery(undefined, {
    enabled: false,
  });

  const publishMutation = api.album.updatePublishStatus.useMutation({
    onSuccess: async () => {
      await refetchAlbums();
      toast(<Toast text="Album set to published" type="success" />);
    },
    onError: () => {
      toast(
        <Toast
          text="Something went wrong updating publish status"
          type="error"
        />
      );
    },
  });

  const canPublish = Boolean(album.coverImageId);

  return (
    <WithTooltip
      text={
        canPublish
          ? "click to set to publish"
          : "can't publish without a cover image"
      }
      type="action"
    >
      <p
        className={`inline-block rounded-lg bg-gray-100 px-xs py-xxxs text-sm tracking-wide text-base-content ${
          canPublish ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={() =>
          canPublish &&
          publishMutation.mutate({ albumId: album.id, isPublished: true })
        }
      >
        draft
      </p>
    </WithTooltip>
  );
};
