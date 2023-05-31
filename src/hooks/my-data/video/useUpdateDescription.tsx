import { api } from "~/utils/api";
import { useVideoContext } from "~/components/+my-pages/videos/_context";
import { useToast } from "~/hooks";
import { updateVideoProperty } from "./_helpers";

export const useUpdateDescription = () => {
  const apiUtils = api.useContext();

  const toast = useToast();

  const updateDescriptionMutation =
    api.youtubeVideo.updateDescription.useMutation({
      async onMutate(mutationInput) {
        const videoQuery = apiUtils.youtubeVideo.getAll;

        const prevData = videoQuery.getData();

        await videoQuery.cancel();

        videoQuery.setData(undefined, (currData) => {
          if (!currData) {
            return prevData;
          }

          const updated = updateVideoProperty({
            data: { value: mutationInput.data.description, videos: currData },
            where: { id: mutationInput.where.id, key: "description" },
          });

          return updated;
        });
      },
      onError() {
        toast.error("Error updating description");
      },
      onSuccess() {
        toast.success("Description updated");
      },
    });

  const video = useVideoContext();

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
        data: { description },
        where: { id: video.id },
      },
      { onSuccess },
    );
};
