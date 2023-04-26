import { toast } from "react-toastify";

import { api } from "~/utils/api";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { MyToast } from "~/components/ui-display";
import { PlusIcon } from "~/components/ui-elements";
import { useAlbumContext } from "../_context/AlbumState";

const AddImageButton = () => {
  const onSelectImage = useAddUploadedImageToAlbum();
  const onUploadImage = useAddUploadImageToAlbum();

  return (
    <SelectOrUploadImageMenu
      uploadPanel={{ onUploadImage }}
      uploadedPanel={{ onSelectImage }}
      button={
        <div className="my-btn-action group flex items-center gap-xs rounded-md py-1.5 px-sm text-white">
          <span className="text-sm">
            <PlusIcon weight="bold" />
          </span>
          <span className="text-sm font-medium">Add image</span>
        </div>
      }
    />
  );
};

export default AddImageButton;

const useAddUploadedImageToAlbum = (): OnSelectImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const addBodyImageMutation = api.album.addImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<MyToast text="added image" type="success" />);
    },
    onError: () => {
      toast(<MyToast text="Something went wrong adding image" type="error" />);
    },
  });

  return ({ imageId }) =>
    addBodyImageMutation.mutate({
      data: { image: { id: imageId, index: album.images.length } },
      where: { albumId: album.id },
    });
};

const useAddUploadImageToAlbum = (): OnUploadImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndAddToBody.useMutation({
      onSuccess: async () => {
        await refetchAlbum();

        setTimeout(() => {
          toast(<MyToast text="added image" type="success" />);
        }, 650);
      },
      onError: () => {
        toast(
          <MyToast text="Something went wrong adding image" type="error" />,
        );
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
          albumImage: { index: album.images.length },
        },
        where: { albumId: album.id },
      },
      { onSuccess },
    );
};
