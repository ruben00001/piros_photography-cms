import { toast } from "react-toastify";

import Toast from "~/components/data-display/Toast";
import { PlusIcon } from "~/components/Icon";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
} from "~/components/image/select-or-upload-image";
import { api } from "~/utils/api";
import { useAlbumContext } from "../_context/AlbumState";

const AddAlbumImageButton = () => {
  const onSelectImage = useAddUploadedImageToAlbum();

  return (
    <SelectOrUploadImageMenu
      uploadPanel={{ onUploadImage: () => null }}
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

export default AddAlbumImageButton;

const useAddUploadedImageToAlbum = (): OnSelectImage => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    }
  );

  const addBodyImageMutation = api.album.addImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="added image" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Something went wrong adding image" type="error" />);
    },
  });

  return ({ imageId }) =>
    addBodyImageMutation.mutate({
      data: { image: { id: imageId, index: album.images.length } },
      where: { albumId: album.id },
    });
};
