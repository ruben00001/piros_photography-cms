import { api } from "~/utils/api";
import { useVideoContext } from "~/components/+my-pages/videos/_context";
import { useToast } from "~/hooks";
import { updateVideoProperty } from "./_helpers";

export const useUpdateTitle = () => {
  const apiUtils = api.useContext();

  const toast = useToast();

  const updateTitleMutation = api.youtubeVideo.updateTitle.useMutation({
    async onMutate(mutationInput) {
      const videoQuery = apiUtils.youtubeVideo.getAll;

      const prevData = videoQuery.getData();

      await videoQuery.cancel();

      videoQuery.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updated = updateVideoProperty({
          data: { value: mutationInput.data.title, videos: currData },
          where: { id: mutationInput.where.id, key: "title" },
        });

        return updated;
      });
    },
    onError() {
      toast.error("Error updating title");
    },
    onSuccess() {
      toast.success("Title updated");
    },
  });

  const video = useVideoContext();

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
        data: { title },
        where: { id: video.id },
      },
      { onSuccess },
    );
};
