import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/album/_context";
import { MyMenu, MyModal, WithTooltip } from "~/components/ui-display";
import { ComponentMenuIcon, DeleteIcon } from "~/components/ui-elements";
import { WarningPanel } from "~/components/ui-written";
import { useAdmin, useToast } from "~/hooks";
import CoverImage from "./CoverImage";

const MetaAndControls = () => {
  const album = useAlbumContext();

  return (
    <div className="group relative flex flex-col gap-sm rounded-lg bg-gray-50 p-xs pb-sm">
      <div className="flex gap-2xl">
        <div className="">
          <span className="mr-xs inline-block text-sm text-gray-400">
            Created
          </span>
          <span className="font-mono text-sm text-gray-500">
            {album.createdAt.toDateString()}
          </span>
        </div>
        <div className="">
          <span className="mr-xs text-sm text-gray-400">Updated</span>
          <span className="font-mono text-sm text-gray-500">
            {album.updatedAt.toDateString()}
          </span>
        </div>
      </div>
      <div>
        <p className="mb-xxs text-sm text-gray-400">Cover image</p>
        <CoverImage />
      </div>
      <div className="flex items-center gap-sm">
        <p className="text-sm text-gray-400">Publish status</p>
        <PublishToggleBadge />
      </div>
      <div className="absolute right-xs top-xs">
        <AlbumMenu />
      </div>
    </div>
  );
};

export default MetaAndControls;

const AlbumMenu = () => (
  <MyMenu
    button={
      <div className="text-gray-300 transition-colors duration-75 ease-in-out hover:!text-gray-600 group-hover:text-gray-400">
        <ComponentMenuIcon />
      </div>
    }
    styles={{ itemsWrapper: "right-0" }}
  >
    <div>
      <DeleteAlbumModal />
    </div>
  </MyMenu>
);

const DeleteAlbumModal = () => {
  const album = useAlbumContext();

  const router = useRouter();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const deleteAlbumMutation = api.album.delete.useMutation({
    async onSuccess() {
      toast.success("Deleted album");
      toast.info("Redirecting...");

      await refetchAlbums();

      setTimeout(() => {
        void router.push("/albums");
      }, 400);
    },
    onError() {
      toast.error("Delete album failed");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <button
          className="my-btn flex items-center gap-xs border-my-alert-content bg-my-alert text-my-alert-content transition-all duration-75 ease-in-out hover:brightness-95"
          onClick={openModal}
          type="button"
        >
          <span>
            <DeleteIcon />
          </span>
          <span className="whitespace-nowrap">Delete album</span>
        </button>
      )}
      panelContent={({ closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              ifAdmin(() =>
                deleteAlbumMutation.mutate(
                  {
                    album: { id: album.id, index: album.index },
                  },
                  {
                    onSuccess() {
                      closeModal();
                    },
                  },
                ),
              ),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete album",
          }}
        />
      )}
    />
  );
};

const PublishToggleBadge = () => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const publishMutation = api.album.updatePublishStatus.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast.success(
        album.published ? "Album unpublished" : "Album set to published",
      );
    },
    onError() {
      toast.error("Something went wrong updating publish status");
    },
  });

  const hasRequiredPublishFields = Boolean(album.coverImageId);

  const { ifAdmin } = useAdmin();

  return (
    <WithTooltip
      text={
        !album.published
          ? hasRequiredPublishFields
            ? "click to publish album"
            : "can't publish without a cover image"
          : "click to unpublish album"
      }
      type="action"
    >
      <p
        className={`inline-block rounded-lg px-xs py-xxxs text-sm tracking-wide
         ${
           album.published
             ? hasRequiredPublishFields
               ? "cursor-pointer bg-my-success text-my-success-content "
               : "cursor-pointer bg-my-alert text-my-alert-content "
             : hasRequiredPublishFields
             ? "cursor-pointer bg-gray-100 text-base-content"
             : "cursor-default bg-gray-50 text-base-300"
         }`}
        onClick={() =>
          ifAdmin(
            () =>
              hasRequiredPublishFields &&
              publishMutation.mutate({
                albumId: album.id,
                isPublished: album.published ? false : true,
              }),
          )
        }
      >
        {album.published ? "published" : "draft"}
      </p>
    </WithTooltip>
  );
};
