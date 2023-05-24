import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/albums/_context";
import { MyCldImage } from "~/components/containers";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { WithTooltip } from "~/components/ui-display";
import { ImageIcon } from "~/components/ui-elements";
import { ImagePlaceholder } from "~/components/ui-written";
import { useAdmin, useToast } from "~/hooks";

const CoverImage = ({ containerWidth }: { containerWidth: number }) => {
  const album = useAlbumContext();

  return (
    <div className="group/coverImage relative">
      {!album.coverImageId ? (
        <ImagePlaceholder />
      ) : (
        <Populated containerWidth={containerWidth} />
      )}
      <UpdateCoverImageMenu />
    </div>
  );
};

export default CoverImage;

const Populated = ({ containerWidth }: { containerWidth: number }) => {
  const album = useAlbumContext();

  if (!album.coverImage) {
    return (
      <p className="text-my-error-content">
        Something went wrong fetching the cover image.
      </p>
    );
  }

  return (
    <div>
      <MyCldImage
        publicId={album.coverImage.cloudinary_public_id}
        dimensions={{
          width: containerWidth,
          height:
            containerWidth /
            (album.coverImage.naturalWidth / album.coverImage.naturalHeight),
        }}
      />
    </div>
  );
};

const UpdateCoverImageMenu = () => {
  const onSelectImage = useUploadedImage();
  const onUploadImage = useUploadImage();

  return (
    <div className="absolute right-1 top-1 z-20 flex items-center gap-sm rounded-md bg-white py-xxs px-xs opacity-0 shadow-lg transition-opacity duration-75 ease-in-out hover:!opacity-100 group-hover/coverImage:opacity-50">
      <SelectOrUploadImageMenu
        button={
          <div className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/coverImage:text-base-content">
            <WithTooltip text="Update image" yOffset={15}>
              <span className="">
                <ImageIcon />
              </span>
            </WithTooltip>
          </div>
        }
        uploadPanel={{ onUploadImage }}
        uploadedPanel={{ onSelectImage }}
        styles={{
          itemsWrapper: "right-0",
        }}
      />
    </div>
  );
};

const useUploadedImage = (): OnSelectImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast.success("updated cover image");
    },
    onError() {
      toast.error("Something went wrong updating cover image");
    },
  });

  return ({ imageId }) =>
    updateCoverImageMutation.mutate({
      albumId: album.id,
      imageId,
    });
};

const useUploadImage = (): OnUploadImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndUpdateCoverImage.useMutation({
      onSuccess: async () => {
        await refetchAlbum();

        setTimeout(() => {
          toast.success("added image");
        }, 650);
      },
      onError() {
        toast.error("Something went wrong adding image");
      },
    });

  const { ifAdmin } = useAdmin();

  return ({
    cloudinary_public_id,
    naturalHeight,
    naturalWidth,
    onSuccess,
    tagIds,
  }) =>
    ifAdmin(() =>
      createImageAndAddToAlbumMutation.mutate(
        {
          data: {
            image: {
              cloudinary_public_id,
              naturalHeight,
              naturalWidth,
              tagIds,
            },
          },
          where: { albumId: album.id },
        },
        { onSuccess },
      ),
    );
};
