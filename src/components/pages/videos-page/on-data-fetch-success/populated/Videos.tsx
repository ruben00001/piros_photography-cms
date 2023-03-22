/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Video from "./video/Entry";
import { VideoProvider } from "~/videos-page/_context";

const Videos = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  return (
    <div>
      {data!.map((youtubeVideo) => (
        <VideoProvider video={youtubeVideo} key={youtubeVideo.id}>
          <Video />
        </VideoProvider>
      ))}
    </div>
  );
};

export default Videos;
