// cover image
// published
// created, updated at

import { toast } from "react-toastify";

import { useAlbumContext } from "../_context/AlbumState";
import { api } from "~/utils/api";

import { CoverImage } from "~/components/pages/album/_containers";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import { useImageTypeContext } from "../_context/ImageType";
import { DeleteIcon } from "~/components/Icon";
import { useRouter } from "next/router";
import { useWarningModalContext } from "~/components/warning-modal";

const MetaPanel = () => {
  const album = useAlbumContext();
  const { setImageContext } = useImageTypeContext();

  return (
    <div className="flex gap-xl p-lg">
      <div className="flex gap-xs">
        <p className="font-mono text-sm">Cover Image:</p>
        <div className="h-auto w-[200px]">
          <CoverImage
            album={album}
            addImageMenu={{
              modals: {
                onVisibilityChange: { onOpen: () => setImageContext("cover") },
              },
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-xs">
        <div className="flex items-baseline gap-xs">
          <p className="font-mono text-sm">Publish status:</p>
          <PublishToggleBadge />
        </div>
        <div className="flex items-baseline gap-xs">
          <p className="font-mono text-sm">Created at:</p>
          <p>{album.createdAt.toDateString()}</p>
        </div>
        <div className="flex items-baseline gap-xs">
          <p className="font-mono text-sm">Updated at:</p>
          <p>{album.updatedAt.toDateString()}</p>
        </div>
      </div>
      <div>
        <DeleteAlbumButton />
      </div>
    </div>
  );
};

export default MetaPanel;

const DeleteAlbumButton = () => {
  const { openModal: openWarningModal } = useWarningModalContext();

  return (
    <div>
      <button
        className="my-btn flex items-center gap-xs border-my-alert-content bg-my-alert text-my-alert-content"
        type="button"
        onClick={() => openWarningModal()}
      >
        <span>
          <DeleteIcon />
        </span>
        <span>Delete album</span>
      </button>
    </div>
  );
};

const PublishToggleBadge = () => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id, includeImages: true },
    {
      enabled: false,
    }
  );

  const publishMutation = api.album.updatePublishStatus.useMutation({
    onSuccess: async () => {
      await refetchAlbum();
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
