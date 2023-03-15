import { useRouter } from "next/router";
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
import { WarningPanel as WarningPanel_ } from "~/components/warning-modal";

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
  const addImageToAlbum = useAddImageToAlbum();

  return (
    <>
      <UploadPanel onUploadImage={createImageAndAddToAlbum} />
      <UploadedPanel onSelectImage={addImageToAlbum} />
      <WarningPanel />
    </>
  );
};

const useCreateImageAndAddToAlbum = (): OnUploadImage => {
  const album = useAlbumContext();
  const { imageContext } = useImageTypeContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
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
                imageContext === "cover"
                  ? "updated cover image"
                  : "updated image"
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
        index: album.images.length,
      },
      { onSuccess }
    );
};

const useAddImageToAlbum = (): OnSelectImage => {
  const album = useAlbumContext();
  const { imageContext } = useImageTypeContext();

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
  });

  const addBodyImageMutation = api.album.addImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="added image" type="success" />);
    },
  });

  const updateBodyImageMutation = api.album.updateImage.useMutation({
    onSuccess: async () => {
      await refetchAlbum();

      toast(<Toast text="updated image" type="success" />);
    },
  });

  return ({ imageId }) =>
    !imageContext
      ? null
      : imageContext === "body-add"
      ? addBodyImageMutation.mutate({
          albumId: album.id,
          imageId,
          index: album.images.length,
        })
      : imageContext === "cover"
      ? updateCoverImageMutation.mutate({ albumId: album.id, imageId })
      : updateBodyImageMutation.mutate({
          data: { imageId },
          where: { albumId: album.id, imageId: imageContext.replace.where.id },
        });
};

const WarningPanel = () => {
  const album = useAlbumContext();

  const router = useRouter();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const deleteAlbumMutation = api.album.delete.useMutation();

  return (
    <WarningPanel_
      onConfirm={({ closeModal }) =>
        deleteAlbumMutation.mutate(
          { album: { id: album.id, index: album.index } },
          {
            onSuccess: async () => {
              closeModal();

              toast(<Toast text="deleted album" type="success" />);
              toast(<Toast text="redirecting..." type="info" />);

              await refetchAlbums();

              setTimeout(() => {
                router.push("/albums");
              }, 400);
            },
            onError: async () => {
              toast(<Toast text="delete album failed" type="error" />);
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
