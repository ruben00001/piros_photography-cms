/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type ReactElement } from "react";

import { api } from "~/utils/api";
import { VideoProvider } from "~/components/+my-pages/videos/_context";
import { DndKit } from "~/components/ui-compounds";
import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import { useAdmin, useToast } from "~/hooks";
import Video from "./video/+Entry";

const Videos = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  const { isAdmin } = useAdmin();

  return (
    <div className="mt-md flex justify-center">
      <div className="w-full max-w-[600px]">
        <div className="flex flex-col gap-lg">
          <DndSortableWrapper>
            {data!.map((youtubeVideo) => (
              <DndKit.Element
                elementId={youtubeVideo.id}
                isDisabled={!isAdmin}
                key={youtubeVideo.id}
              >
                <VideoProvider video={youtubeVideo}>
                  <Video />
                </VideoProvider>
              </DndKit.Element>
            ))}
          </DndSortableWrapper>
        </div>
      </div>
    </div>
  );
};

export default Videos;

// □ refactor below

const DndSortableWrapper = ({ children }: { children: ReactElement[] }) => {
  const { data } = api.youtubeVideo.getAll.useQuery(undefined, {
    enabled: false,
  });
  const videos = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

  const toast = useToast();

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
                },
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

      toast.error("Error reordering videos");
    },
    onSuccess() {
      toast.success("Videos reordered");
    },
  });

  const { isAdmin } = useAdmin();

  return (
    <DndKit.Context
      elementIds={mapIds(videos)}
      onReorder={({ activeId, overId }) => {
        if (!isAdmin) {
          return;
        }
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
    </DndKit.Context>
  );
};
