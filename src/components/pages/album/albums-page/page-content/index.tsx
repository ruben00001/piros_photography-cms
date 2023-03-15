import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumsContext } from "../_context/AlbumsState";

import {
  UploadPanel,
  type OnUploadImage,
} from "~/components/image/add-image/upload-modal";
import {
  UploadedPanel,
  type OnSelectImage,
} from "~/components/image/add-image/uploaded-modal";
import Albums from "./albums";
import { AddAlbumPanel } from "./albums/AddAlbumModal";
import Toast from "~/components/data-display/Toast";
import { WarningPanel as WarningPanel_ } from "~/components/warning-modal";

const PageContent = () => {
  return (
    <>
      <div className="p-md">
        <div className="mt-8">
          <Albums />
        </div>
      </div>
      <ModalPanels />
    </>
  );
};

export default PageContent;

const ModalPanels = () => {
  const { activeAlbum } = useAlbumsContext();

  const createImageAndAddToAlbum = useCreateImageAndAddToAlbumCoverImage();

  const addImageToAlbumCoverImage = useAddImageToAlbumCoverImage();

  return (
    <>
      <AddAlbumPanel />
      <UploadPanel onUploadImage={createImageAndAddToAlbum} />
      <UploadedPanel onSelectImage={addImageToAlbumCoverImage} />
      <WarningPanel />
    </>
  );
};

const useCreateImageAndAddToAlbumCoverImage = (): OnUploadImage => {
  const { activeAlbum } = useAlbumsContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndAddToAlbum.useMutation({
      onSuccess: async () => {
        await refetchAlbums();

        setTimeout(() => {
          toast(<Toast text="updated cover image" type="success" />);
        }, 950);
      },
    });

  return ({ cloudinary_public_id, tagIds, onSuccess }) =>
    activeAlbum &&
    createImageAndAddToAlbumMutation.mutate(
      {
        albumId: activeAlbum.id,
        cloudinary_public_id,
        tagIds,
        imageType: "cover",
      },
      { onSuccess }
    );
};

const useAddImageToAlbumCoverImage = (): OnSelectImage => {
  const { activeAlbum } = useAlbumsContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      await refetchAlbums();

      toast(<Toast text="updated cover image" type="success" />);
    },
  });

  return ({ imageId }) =>
    activeAlbum &&
    updateCoverImageMutation.mutate({ albumId: activeAlbum.id, imageId });
};

const WarningPanel = () => {
  const { activeAlbum } = useAlbumsContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const deleteAlbumMutation = api.album.delete.useMutation({
    onSuccess: async () => {
      await refetchAlbums();
    },
  });

  return (
    <WarningPanel_
      onConfirm={({ closeModal }) =>
        activeAlbum &&
        deleteAlbumMutation.mutate(
          { album: { id: activeAlbum.id, index: activeAlbum.index } },
          {
            onSuccess: () => {
              setTimeout(() => {
                deleteAlbumMutation.reset();
                closeModal();
              }, 400);
              setTimeout(() => {
                toast(<Toast text="Album deleted" type="success" />);
              }, 450);
            },
          }
        )
      }
      text={{
        body: "Are you sure? This can't be undone.",
        title: "Delete album",
      }}
      invokedFuncStatus={deleteAlbumMutation.status}
    />
  );
};
