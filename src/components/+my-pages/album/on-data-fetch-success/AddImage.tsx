import { api } from "~/utils/api";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { PlusIcon } from "~/components/ui-elements";
import { useAdmin, useToast } from "~/hooks";
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

  const toast = useToast();

  const addBodyImageMutation = api.album.addImage.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast.success("Added image");
    },
    onError() {
      toast.error("Something went wrong adding image");
    },
  });

  const { ifAdmin } = useAdmin();

  return ({ imageId }) =>
    ifAdmin(() =>
      addBodyImageMutation.mutate({
        data: { image: { id: imageId, index: album.images.length } },
        where: { albumId: album.id },
      }),
    );
};

const useAddUploadImageToAlbum = (): OnUploadImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndAddToBody.useMutation({
      async onSuccess() {
        await refetchAlbum();

        setTimeout(() => {
          toast.success("Added image");
        }, 650);
      },
      onError() {
        toast.success("Something went wrong adding image");
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
            albumImage: { index: album.images.length },
          },
          where: { albumId: album.id },
        },
        { onSuccess },
      ),
    );
};
