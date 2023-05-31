import { useMeasure } from "react-use";

import { useVideoContext } from "~/components/+my-pages/videos/_context";
import { DataTextAreaForm, DataTextInputForm } from "~/components/ui-compounds";
import { VideoIFrame } from "~/components/ui-elements";
import { getYoutubeEmbedUrlFromId } from "~/helpers/youtube";
import { useAdmin } from "~/hooks";
import { useUpdateDescription, useUpdateTitle } from "~/hooks/my-data/video";

const Content = () => (
  <div className="flex justify-center">
    <div className="w-full max-w-[600px]">
      <Title />
      <Description />
      <VideoEmbed />
    </div>
  </div>
);

export default Content;

const Title = () => {
  const video = useVideoContext();

  const updateTitle = useUpdateTitle();

  const { ifAdmin } = useAdmin();

  return (
    <div className="max-w-[80%] text-xl">
      <DataTextInputForm
        input={{
          initialValue: video.title,
          minWidth: 300,
          placeholder: "Video title (optional)",
        }}
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() => updateTitle({ title: inputValue }, { onSuccess }))
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

  const updateDescription = useUpdateDescription();

  const { ifAdmin } = useAdmin();

  return (
    <div className="mb-xs w-[90%] font-serif text-lg">
      <DataTextAreaForm
        initialValue={video.description}
        tooltipText="click to edit description"
        placeholder="Video description (optional)"
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() =>
            updateDescription({ description: inputValue }, { onSuccess }),
          )
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
