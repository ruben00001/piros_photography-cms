import { api } from "~/utils/api";
import {
  useAlbumContext,
  useAlbumImageContext,
} from "~/components/+my-pages/album/_context";
import { updateAlbumImageProperty } from "~/helpers/update-data/album";
import useToast from "~/hooks/useToast";

export const useUpdateDescription = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const utils = api.useContext();

  const myToast = useToast();

  const updateDescriptionMutation =
    api.albumImage.updateDescription.useMutation({
      async onMutate({ albumImageId, updatedDescription }) {
        const prevData = utils.album.albumPageGetOne.getData();

        await utils.album.albumPageGetOne.cancel();

        utils.album.albumPageGetOne.setData(
          { albumId: album.id },
          (currData) => {
            if (!currData) {
              return prevData;
            }

            const updatedAlbum = updateAlbumImageProperty({
              data: { album, value: updatedDescription },
              where: { albumImageId, key: "description" },
            });

            return updatedAlbum;
          },
        );
      },
      onSuccess() {
        myToast.success("Description updated");
      },
      onError() {
        myToast.error("Something went wrong updating the description");
      },
    });

  return (
    {
      description,
    }: {
      description: string;
    },
    {
      onSuccess,
    }: {
      onSuccess: () => void;
    },
  ) =>
    updateDescriptionMutation.mutate(
      {
        albumImageId: albumImage.id,
        updatedDescription: description,
      },
      { onSuccess },
    );
};
