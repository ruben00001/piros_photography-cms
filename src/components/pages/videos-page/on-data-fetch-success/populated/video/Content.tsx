import produce from "immer";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";
import Toast from "~/components/data-display/Toast";

import DataTextAreaForm from "~/components/forms/TextAreaFormNEW";
import { DataTextInputForm } from "~/components/forms/DataTextInputForm";
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
    <div className="max-w-[80%] text-xl">
      <DataTextInputForm
        input={{
          initialValue: video.title,
          minWidth: 300,
          placeholder: "Video title (optional)",
        }}
        onSubmit={({ inputValue }) =>
          updateTitleMutation.mutate({
            data: { title: inputValue },
            where: { id: video.id },
          })
        }
        tooltip={{
          text: "click to edit title",
        }}
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
    <div className="mb-xs w-[90%] font-serif text-lg">
      <DataTextAreaForm
        initialValue={video.description}
        tooltipText="click to edit description"
        placeholder="Video description (optional)"
        onSubmit={({ inputValue }) =>
          updateDescriptionMutation.mutate({
            data: { description: inputValue },
            where: { id: video.id },
          })
        }
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
