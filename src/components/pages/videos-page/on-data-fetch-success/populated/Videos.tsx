/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type ReactElement } from "react";
import { toast } from "react-toastify";

import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";
import { VideoProvider } from "~/videos-page/_context";
import Video from "./video/Entry";

import { findEntityById } from "~/helpers/query-data";

import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import DndSortableElement from "~/components/dnd-kit/DndSortableElement";

const Videos = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[600px]">
        <div className="flex flex-col gap-lg">
          <DndSortableWrapper>
            {data!.map((youtubeVideo) => (
              <DndSortableElement
                elementId={youtubeVideo.id}
                key={youtubeVideo.id}
              >
                <VideoProvider video={youtubeVideo}>
                  <Video />
                </VideoProvider>
              </DndSortableElement>
            ))}
          </DndSortableWrapper>
        </div>
      </div>
    </div>
  );
};

export default Videos;

const DndSortableWrapper = ({ children }: { children: ReactElement[] }) => {
  const { data } = api.youtubeVideo.getAll.useQuery(undefined, {
    enabled: false,
  });
  const videos = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

  const reorderMutation = api.youtubeVideo.reorder.useMutation({
    onMutate: (mutationInput) => {
      const prevData = apiUtils.youtubeVideo.getAll.getData();

      const updatedEntities = getReorderedEntities({
        active: mutationInput.where.activeVideo,
        over: mutationInput.where.overVideo,
        entities: mutationInput.currData.allVideos,
      });

      apiUtils.youtubeVideo.getAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = currData
          .map((video) =>
            !mapIds(updatedEntities).includes(video.id)
              ? video
              : {
                  ...video,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  index: updatedEntities.find(({ id }) => id === video.id)!
                    .index,
                }
          )
          .sort(sortByIndex);

        return updatedData;
      });

      return { prevData };
    },
    onError(_err, _mutationArgs, ctx) {
      if (!ctx?.prevData) {
        return;
      }
      apiUtils.youtubeVideo.getAll.setData(undefined, ctx.prevData);

      toast(<Toast text="Error reordering videos" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Videos reordered" type="success" />);
    },
  });

  return (
    <DndSortableContext
      elementIds={mapIds(videos)}
      onReorder={({ activeId, overId }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeVideo = findEntityById(videos, activeId)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overVideo = findEntityById(videos, overId)!;

        const noChange = activeVideo.id === overVideo.id;

        if (noChange) {
          return;
        }

        reorderMutation.mutate({
          currData: { allVideos: videos },
          where: { activeVideo, overVideo },
        });
      }}
    >
      {children}
    </DndSortableContext>
  );
};
