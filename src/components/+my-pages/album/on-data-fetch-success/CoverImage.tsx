import { api } from "~/utils/api";
import { MyCldImage } from "~/components/containers";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { WithTooltip } from "~/components/ui-display";
import { ImageIcon } from "~/components/ui-elements";
import { ImagePlaceholder } from "~/components/ui-written";
import { calcImageDimensions } from "~/helpers/general";
import { useAdmin, useToast } from "~/hooks";
import { useAlbumContext } from "../_context/AlbumState";

const CoverImage = () => {
  const album = useAlbumContext();

  return (
    <div className="group/coverImage relative inline-block">
      {!album.coverImageId ? <Unpopulated /> : <Populated />}
      <UpdateCoverImageMenu />
    </div>
  );
};

export default CoverImage;

const Unpopulated = () => (
  <div className="w-[300px]">
    <ImagePlaceholder />
  </div>
);

const Populated = () => {
  const album = useAlbumContext();

  if (!album.coverImage) {
    return (
      <p className="text-my-error-content">
        Something went wrong fetching the cover image.
      </p>
    );
  }

  const imageDimensions = calcImageDimensions({
    constraint: {
      maxDecimal: { height: 1, width: 1 },
      value: { height: 300, width: 400 },
    },
    image: {
      height: album.coverImage.naturalHeight,
      width: album.coverImage.naturalWidth,
    },
  });

  return (
    <MyCldImage
      dimensions={imageDimensions}
      publicId={album.coverImage.cloudinary_public_id}
    />
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
      />
    </div>
  );
};

const useUploadedImage = (): OnSelectImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast.success("updated cover image");
    },
    onError() {
      toast.error("Something went wrong updating cover image");
    },
  });

  const { ifAdmin } = useAdmin();

  return ({ imageId }) =>
    ifAdmin(() =>
      updateCoverImageMutation.mutate({
        albumId: album.id,
        imageId,
      }),
    );
};

const useUploadImage = (): OnUploadImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndUpdateCoverImage.useMutation({
      async onSuccess() {
        await refetchAlbum();

        setTimeout(() => {
          toast.success("Added image");
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
