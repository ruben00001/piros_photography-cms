import { toast } from "react-toastify";

import { api } from "~/utils/api";
import {
  useAlbumContext,
  useAlbumImageContext,
} from "~/components/+my-pages/album/_context";
import {
  SelectOrUploadImageMenu,
  type OnSelectImage,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { MyModal, MyToast, WithTooltip } from "~/components/ui-display";
import { DeleteIcon, ExpandIcon, ImageIcon } from "~/components/ui-elements";
import { WarningPanel } from "~/components/ui-written";
import OpenedImage from "./OpenedImage";

const Menu = () => {
  return (
    <div
      className={`absolute right-1 top-1 z-20 flex items-center gap-sm rounded-md bg-white py-xxs px-xs opacity-0 shadow-lg transition-opacity duration-75 ease-in-out hover:!opacity-100 group-hover/albumImage:opacity-50`}
    >
      <ChangeImageMenu />
      <OpenAlbumImageModal />
      <DeleteModal />
    </div>
  );
};

export default Menu;

const ChangeImageMenu = () => {
  const onSelectImage = useUploadedImage();
  const onUploadImage = useUploadImage();

  return (
    <SelectOrUploadImageMenu
      button={({ isOpen }) => (
        <div className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/albumImage:text-base-content">
          <WithTooltip text="Change image" yOffset={15} isDisabled={isOpen}>
            <span>
              <ImageIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      uploadPanel={{ onUploadImage }}
      uploadedPanel={{ onSelectImage }}
    />
  );
};

const OpenAlbumImageModal = () => {
  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/albumImage:text-base-content"
          onClick={openModal}
        >
          <WithTooltip text="Open image" yOffset={15}>
            <span className="">
              <ExpandIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={() => <OpenedImage />}
    />
  );
};

const DeleteModal = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const deleteMutation = api.album.deleteImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<MyToast text="deleted image" type="success" />);
    },
    onError: () => {
      toast(<MyToast text="delete image failed" type="error" />);
    },
  });

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert"
          onClick={openModal}
        >
          <WithTooltip text="Delete album image" yOffset={15}>
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={({ closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              deleteMutation.mutate({
                data: { index: albumImage.index },
                where: { albumId: album.id, imageId: albumImage.id },
              }),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete album image",
          }}
        />
      )}
    />
  );
};

const useUploadedImage = (): OnSelectImage => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const addBodyImageMutation = api.album.updateImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<MyToast text="changed image" type="success" />);
    },
    onError: () => {
      toast(
        <MyToast text="Something went wrong changing image" type="error" />,
      );
    },
  });

  return ({ imageId: newImageId }) =>
    addBodyImageMutation.mutate({
      data: { imageId: newImageId },
      where: { albumId: album.id, imageId: albumImage.id },
    });
};

const useUploadImage = (): OnUploadImage => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    {
      enabled: false,
    },
  );

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndUpdateBodyImage.useMutation({
      onSuccess: async () => {
        await refetchAlbum();

        setTimeout(() => {
          toast(<MyToast text="changed image" type="success" />);
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
        },
        where: { albumId: album.id, imageId: albumImage.id },
      },
      { onSuccess },
    );
};
