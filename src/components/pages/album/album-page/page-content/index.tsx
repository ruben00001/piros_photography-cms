import { toast } from "react-toastify";

import { useAlbumContext } from "../_context/AlbumState";
import { useImageTypeContext } from "../_context/ImageType";
import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";
import MetaPanel from "./MetaPanel";
import AlbumBody from "./body";
import AddImageButton from "./AddImage";
import {
  OnUploadImage,
  UploadPanel,
} from "~/components/image/add-image/upload-modal";
import {
  OnSelectImage,
  UploadedPanel,
} from "~/components/image/add-image/uploaded-modal";

// album image: title, desc.

const PageContent = () => {
  return (
    <>
      <div>
        <MetaPanel />
        <AddImageButton />
        <AlbumBody />
      </div>
      <ModalPanels />
    </>
  );
};

export default PageContent;

const ModalPanels = () => {
  const createImageAndAddToAlbum = useCreateImageAndAddToAlbum();

  return (
    <>
      <UploadPanel onUploadImage={createImageAndAddToAlbum} />
      {/* <UploadedPanel onSelectImage={addImageToAlbumCoverImage} /> */}
    </>
  );
};

const useCreateImageAndAddToAlbum = (): OnUploadImage => {
  const album = useAlbumContext();
  const { imageContext } = useImageTypeContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id, includeImages: true },
    {
      enabled: false,
    }
  );

  const createImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndAddToAlbum.useMutation({
      onSuccess: async () => {
        await refetchAlbum();

        setTimeout(() => {
          toast(
            <Toast
              text={
                imageContext === "body" ? "added image" : "updated cover image"
              }
              type="success"
            />
          );
        }, 950);
      },
    });

  return ({ cloudinary_public_id, tagIds, onSuccess }) =>
    imageContext &&
    createImageAndAddToAlbumMutation.mutate(
      {
        albumId: album.id,
        cloudinary_public_id,
        tagIds,
        imageType: imageContext,
      },
      { onSuccess }
    );
};

const useAddImageToAlbum = (): OnSelectImage => {
  const album = useAlbumContext();
  const { imageContext } = useImageTypeContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id, includeImages: true },
    {
      enabled: false,
    }
  );

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="updated cover image" type="success" />);
    },
  });

  const addBodyImageMutation = api.album.addImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="updated cover image" type="success" />);
    },
  });

  return ({ imageId }) =>
    imageContext && imageContext === "body"
      ? addBodyImageMutation.mutate({
          albumId: album.id,
          imageId,
          index: album.images.length,
        })
      : updateCoverImageMutation.mutate({ albumId: album.id, imageId });
};

/* const WarningPanel = () => {
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
 */
