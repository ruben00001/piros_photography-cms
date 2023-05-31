import { type YoutubeVideo } from "@prisma/client";
import produce from "immer";

import { type MyPick } from "~/types/utilities";

type UpdatableKey = keyof MyPick<
  YoutubeVideo,
  "description" | "title" | "youtubeVideoId" | "index"
>;

export function updateVideoProperty<TKey extends UpdatableKey>(input: {
  data: { videos: YoutubeVideo[]; value: YoutubeVideo[TKey] };
  where: { id: string; key: TKey };
}) {
  const updated = produce(input.data.videos, (draft) => {
    const videoIndex = draft.findIndex((video) => video.id === input.where.id);
    const video = draft[videoIndex];
    if (!video) {
      return;
    }

    video[input.where.key] = input.data.value;
  });

  return updated;
}

// below won't work because key and value aren't tied
/* export function updateVideoProperty2
(input: {
  data: { video: YoutubeVideo; value: YoutubeVideo[UpdatableKey] };
  where: { key: UpdatableKey };
}) {
  const updated = produce(input.data.video, (draft) => {
    draft[input.where.key] = input.data.value;
  });

  return updated;
}
 */
