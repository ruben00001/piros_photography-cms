import { useState, useRef } from "react";
import { toast } from "react-toastify";

import { AlbumProvider, useAlbumContext } from "../../../_context/AlbumState";
import { useAlbumsContext } from "../../../_context/AlbumsState";

import { api, RouterOutputs } from "~/utils/api";

import TextInput from "~/components/forms/TextInput";
import Toast from "~/components/data-display/Toast";
import DndSortableElement from "~/components/dnd-kit/DndSortableElement";
import WithTooltip from "~/components/data-display/WithTooltip";
import AlbumMenu from "./Menu";
import { CoverImage } from "~/components/pages/album/_containers";
import { GoToPageIcon } from "~/components/Icon";
import Link from "next/link";
import { TextInputForm } from "~/components/TextInputForm";

type AlbumType = RouterOutputs["album"]["albumsPageGetAll"][0];

const Album = ({ album }: { album: AlbumType }) => {
  return (
    <DndSortableElement
      elementId={album.id}
      wrapperClasses="group/album relative rounded-lg border border-transparent p-sm transition-colors duration-75 ease-in-out focus-within:border-base-300 hover:border-base-200"
    >
      <AlbumProvider album={album}>
        <AlbumContent />
      </AlbumProvider>
    </DndSortableElement>
  );
};

export default Album;

const AlbumContent = () => {
  const album = useAlbumContext();
  const { setActiveAlbum } = useAlbumsContext();

  return (
    <div className="flex h-full flex-col">
      <AlbumMenu />
      <AlbumTitleInput />
      <CoverImage
        addImageMenu={{
          modals: {
            onVisibilityChange: { onOpen: () => setActiveAlbum(album) },
          },
        }}
        album={album}
      />
      <div className=" flex flex-grow flex-col justify-between opacity-0 transition-all duration-150 ease-in-out group-hover/album:opacity-100">
        <div></div>
        <div className="flex items-center justify-between pt-xs">
          <MetaInfo />
          <GoToPage />
        </div>
      </div>
    </div>
  );
};

const AlbumTitleInput = () => {
  const album = useAlbumContext();

  const updateTitle = api.album.updateTitle.useMutation();

  return (
    <div className="mb-xs text-3xl">
      <TextInputForm
        onSubmit={({ inputValue, onSuccess }) =>
          updateTitle.mutate(
            { albumId: album.id, updatedTitle: inputValue },
            {
              onSuccess: async () => {
                toast(<Toast text="Title updated" type="success" />);

                onSuccess();
              },
            }
          )
        }
        tooltipText="click to edit title"
        initialValue={album.title}
        placeholder="Album title"
      />
    </div>
  );
};

const MetaInfo = () => {
  const { published } = useAlbumContext();

  if (published) {
    return <div></div>;
  }

  return <PublishStatusBadge />;
};

const PublishStatusBadge = () => {
  const album = useAlbumContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

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

const GoToPage = () => {
  const album = useAlbumContext();

  return (
    <Link href={`/albums/${album.id}`} passHref>
      <div className="cursor-pointer rounded-sm border border-transparent py-xxxs px-xxs transition-colors duration-150 ease-in-out hover:border-gray-200 hover:bg-gray-100">
        <div className="flex items-center gap-xs text-xs text-gray-500">
          <span>
            <GoToPageIcon />
          </span>
          <span className="uppercase text-gray-500">Go to album</span>
        </div>
      </div>
    </Link>
  );
};
