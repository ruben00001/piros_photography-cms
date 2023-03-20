import { calcImageDimensions } from "~/helpers/general";
import { useAlbumContext } from "../_context/AlbumState";

import MyCldImage from "~/components/image/MyCldImage2";
import ImagePlaceholder from "~/components/image/Placeholder";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/image/select-or-upload-image";
import WithTooltip from "~/components/data-display/WithTooltip";
import { ImageIcon } from "~/components/Icon";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";

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

const Unpopulated = () => {
  return (
    <div className="aspect-square w-[300px]">
      <ImagePlaceholder />
    </div>
  );
};

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
      src={album.coverImage.cloudinary_public_id}
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
    }
  );

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="updated cover image" type="success" />);
    },
    onError: () => {
      toast(
        <Toast text="Something went wrong updating cover image" type="error" />
      );
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

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    }
  );

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndUpdateCoverImage.useMutation({
      onSuccess: async () => {
        await refetchAlbum();

        setTimeout(() => {
          toast(<Toast text="added image" type="success" />);
        }, 650);
      },
      onError: () => {
        toast(<Toast text="Something went wrong adding image" type="error" />);
      },
    });

  return ({
    cloudinary_public_id,
    naturalHeight,
    naturalWidth,
    onSuccess,
    tagIds,
  }) =>
    createImageAndAddToAlbumMutation.mutate(
      {
        data: {
          image: { cloudinary_public_id, naturalHeight, naturalWidth, tagIds },
        },
        where: { albumId: album.id },
      },
      { onSuccess }
    );
};
