import { api } from "~/utils/api";
import {
  useAlbumContext,
  useAlbumImageContext,
} from "~/components/+my-pages/album/_context";
import { updateAlbumImageProperty } from "~/helpers/update-data/album";
import { useToast } from "~/hooks";

export const useUpdateTitle = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const utils = api.useContext();

  const toast = useToast();

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
      toast.success("Title updated");
    },
    onError() {
      toast.error("Something went wrong updating the title");
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
