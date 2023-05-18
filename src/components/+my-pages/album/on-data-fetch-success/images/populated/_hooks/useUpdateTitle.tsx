import { api } from "~/utils/api";
import {
  useAlbumContext,
  useAlbumImageContext,
} from "~/components/+my-pages/album/_context";
import { updateAlbumImageProperty } from "~/helpers/update-data/album";
import useToast from "~/hooks/useToast";

export const useUpdateTitle = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const utils = api.useContext();

  const myToast = useToast();

  const updateTitleMutation = api.albumImage.updateTitle.useMutation({
    async onMutate({ albumImageId, updatedTitle }) {
      const prevData = utils.album.albumPageGetOne.getData();

      await utils.album.albumPageGetOne.cancel();

      utils.album.albumPageGetOne.setData({ albumId: album.id }, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedAlbum = updateAlbumImageProperty({
          data: { album, value: updatedTitle },
          where: { albumImageId, key: "title" },
        });

        return updatedAlbum;
      });
    },
    onSuccess() {
      myToast.success("Title updated");
    },
    onError() {
      myToast.error("Something went wrong updating the title");
    },
  });

  return (
    {
      title,
    }: {
      title: string;
    },
    {
      onSuccess,
    }: {
      onSuccess: () => void;
    },
  ) =>
    updateTitleMutation.mutate(
      {
        albumImageId: albumImage.id,
        updatedTitle: title,
      },
      { onSuccess },
    );
};
