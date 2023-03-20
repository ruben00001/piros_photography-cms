import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumContext } from "../_context/AlbumState";

import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import { Modal, WarningPanel } from "~/components/modal";
import MyMenu from "~/components/MyMenu";
import CoverImage from "./CoverImage";

const MetaPanel = () => {
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
      <div className="flex flex-col gap-xxs">
        <p className="text-sm text-gray-400">Cover image</p>
        <div className="h-auto w-[350px]">
          <CoverImage />
        </div>
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

export default MetaPanel;

const AlbumMenu = () => {
  return (
    <MyMenu
      button={
        <div className="text-gray-300 transition-colors duration-75 ease-in-out hover:!text-gray-600 group-hover:text-gray-400">
          <MenuIcon />
        </div>
      }
      styles={{ itemsWrapper: "right-0" }}
    >
      <div>
        <DeleteAlbumModal />
      </div>
    </MyMenu>
  );
};

const DeleteAlbumModal = () => {
  const album = useAlbumContext();

  const router = useRouter();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const deleteAlbumMutation = api.album.delete.useMutation({
    onSuccess: async () => {
      toast(<Toast text="deleted album" type="success" />);
      toast(<Toast text="redirecting..." type="info" />);

      await refetchAlbums();

      setTimeout(() => {
        void router.push("/albums");
      }, 400);
    },
    onError: () => {
      toast(<Toast text="delete album failed" type="error" />);
    },
  });

  return (
    <Modal
      button={({ open: openModal }) => (
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
      panelContent={({ close: closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              deleteAlbumMutation.mutate(
                {
                  album: { id: album.id, index: album.index },
                },
                {
                  onSuccess() {
                    closeModal();
                  },
                }
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
    }
  );

  const publishMutation = api.album.updatePublishStatus.useMutation({
    onSuccess: async () => {
      await refetchAlbum();
      toast(
        <Toast
          text={
            album.published ? "Album unpublished" : "Album set to published"
          }
          type="success"
        />
      );
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

  const hasRequiredPublishFields = Boolean(album.coverImageId);

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
          hasRequiredPublishFields &&
          publishMutation.mutate({
            albumId: album.id,
            isPublished: album.published ? false : true,
          })
        }
      >
        {album.published ? "published" : "draft"}
      </p>
    </WithTooltip>
  );
};

/* const PublishedErrorMessage = () => {
  const album = useAlbumContext();

  if (!album.published) {
    return null;
  }

  const hasRequiredPublishFields =
    album.coverImageId && album.title && album.images.length;

  if (hasRequiredPublishFields) {
    return null;
  }

  return (
    <div>
      <h4>This album is published but is missing required fields</h4>
      <p>It won't be shown on the site.</p>
    </div>
  );
};
 */
