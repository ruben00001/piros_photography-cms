import { toast } from "react-toastify";

import { useAlbumContext } from "../_context/AlbumState";
import { useImageTypeContext } from "../_context/ImageType";
import { UploadedModalVisibilityProvider } from "~/context/UploadedModalVisibilityState";
import { UploadModalVisibilityProvider } from "~/context/UploadModalVisibilityState";
import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";
import UploadPanel from "~/components/image/add-image/upload-modal";
import UploadedModal from "~/components/image/add-image/uploaded-modal";
import MetaPanel from "./MetaPanel";
import AlbumBody from "./body";
import AddImageButton from "./AddImage";

// album image: title, desc.

const PageContent = () => {
  const album = useAlbumContext();
  const { imageContext, setImageContext } = useImageTypeContext();

  const { refetch } = api.album.getOne.useQuery(
    {
      albumId: album.id,
      includeImages: true,
    },
    { enabled: false }
  );

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      await refetch();

      toast(<Toast text="updated cover image" type="success" />);
    },
  });

  const addImageMutation = api.album.addImage.useMutation({
    onSuccess: async () => {
      await refetch();

      toast(<Toast text="added image" type="success" />);
    },
  });

  const createImageAndAddToAlbum =
    api.imageAndAlbumTransaction.createImageAndAddToAlbum.useMutation({
      onSuccess: async () => {
        await refetch();

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

  return (
    <UploadModalVisibilityProvider onClose={() => setImageContext(null)}>
      <UploadedModalVisibilityProvider onClose={() => setImageContext(null)}>
        <>
          <div>
            <MetaPanel />
            <AddImageButton />
            <AlbumBody />
          </div>
          <UploadedModal
            onSelectImage={(imageId) =>
              imageContext === "cover"
                ? updateCoverImageMutation.mutate({
                    albumId: album.id,
                    imageId,
                  })
                : addImageMutation.mutate({ albumId: album.id, imageId })
            }
          />
          <UploadPanel
            createDbImageFunc={({ cloudinary_public_id, onSuccess, tagIds }) =>
              imageContext &&
              createImageAndAddToAlbum.mutate(
                {
                  albumId: album.id,
                  cloudinary_public_id,
                  imageType: imageContext,
                  tagIds,
                },
                { onSuccess }
              )
            }
          />
        </>
      </UploadedModalVisibilityProvider>
    </UploadModalVisibilityProvider>
  );
};

export default PageContent;
