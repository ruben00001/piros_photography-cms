import produce from "immer";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";
import Toast from "~/components/data-display/Toast";
import { TextInputForm } from "~/components/forms/TextInputFormDynamic";
import VideoIFrame from "~/components/VideoIFrame";
import { getYoutubeEmbedUrlFromId } from "~/helpers/youtube";
import { api } from "~/utils/api";
import { useVideoContext } from "~/videos-page/_context";

const Content = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[600px]">
        <Title />
        <Description />
        <VideoEmbed />
      </div>
    </div>
  );
};

export default Content;

const Title = () => {
  const video = useVideoContext();

  const apiUtils = api.useContext();

  const updateTitleMutation = api.youtubeVideo.updateTitle.useMutation({
    async onMutate(mutationInput) {
      const prevData = apiUtils.youtubeVideo.getAll.getData();

      await apiUtils.youtubeVideo.getAll.cancel();

      apiUtils.youtubeVideo.getAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = produce(currData, (draft) => {
          const videoIndex = draft.findIndex(
            (draftVideo) => draftVideo.id === mutationInput.where.id
          );
          const draftVideo = draft[videoIndex];

          if (!draftVideo) {
            return;
          }

          draftVideo.title === mutationInput.data.title;
        });

        return updatedData;
      });
    },
    onError: () => {
      toast(<Toast text="Error updating title" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Title updated" type="success" />);
    },
  });

  return (
    <div className="text-2xl">
      <TextInputForm
        onSubmit={({ inputValue }) =>
          updateTitleMutation.mutate({
            data: { title: inputValue },
            where: { id: video.id },
          })
        }
        tooltipText="click to edit title"
        initialValue={video.title}
        placeholder="Video title (optional)"
        minWidth={300}
      />
    </div>
  );
};

const Description = () => {
  const video = useVideoContext();

  const apiUtils = api.useContext();

  const updateDescriptionMutation =
    api.youtubeVideo.updateDescription.useMutation({
      async onMutate(mutationInput) {
        const prevData = apiUtils.youtubeVideo.getAll.getData();

        await apiUtils.youtubeVideo.getAll.cancel();

        apiUtils.youtubeVideo.getAll.setData(undefined, (currData) => {
          if (!currData) {
            return prevData;
          }

          const updatedData = produce(currData, (draft) => {
            const videoIndex = draft.findIndex(
              (draftVideo) => draftVideo.id === mutationInput.where.id
            );
            const draftVideo = draft[videoIndex];

            if (!draftVideo) {
              return;
            }

            draftVideo.description === mutationInput.data.description;
          });

          return updatedData;
        });
      },
      onError: () => {
        toast(<Toast text="Error updating description" type="error" />);
      },
      onSuccess: () => {
        toast(<Toast text="Description updated" type="success" />);
      },
    });

  return (
    <div className="mb-xs font-serif text-lg">
      <TextInputForm
        onSubmit={({ inputValue }) =>
          updateDescriptionMutation.mutate({
            data: { description: inputValue },
            where: { id: video.id },
          })
        }
        tooltipText="click to edit description"
        initialValue={video.description}
        placeholder="Video description (optional)"
        minWidth={300}
      />
    </div>
  );
};

const VideoEmbed = () => {
  const { youtubeVideoId } = useVideoContext();

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div className="aspect-video" ref={containerRef}>
      {width && height ? (
        <VideoIFrame
          src={getYoutubeEmbedUrlFromId(youtubeVideoId)}
          height={height}
          width={width}
        />
      ) : null}
    </div>
  );
};
