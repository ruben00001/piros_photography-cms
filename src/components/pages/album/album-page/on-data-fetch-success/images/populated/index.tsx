import { type ReactElement } from "react";
import { toast } from "react-toastify";

import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import { api } from "~/utils/api";

import { AlbumImageProvider, useAlbumContext } from "~/album-page/_context";
import Toast from "~/components/data-display/Toast";
import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import AlbumImage from "./image";
import DndSortableElement from "~/components/dnd-kit/DndSortableElement";
import produce from "immer";

const Populated = () => {
  const album = useAlbumContext();

  return (
    <>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        <ImagesDndSortableContext>
          {album.images.map((albumImage) => (
            <DndSortableElement elementId={albumImage.id} key={albumImage.id}>
              <AlbumImageProvider albumImage={albumImage}>
                <AlbumImage />
              </AlbumImageProvider>
            </DndSortableElement>
          ))}
        </ImagesDndSortableContext>
      </div>
    </>
  );
};

export default Populated;

const ImagesDndSortableContext = ({
  children,
}: {
  children: ReactElement[];
}) => {
  const album = useAlbumContext();

  const apiUtils = api.useContext();

  const reorderMutation = api.album.reorderImages.useMutation({
    onMutate: ({ activeAlbumImage, albumImages, overAlbumImage }) => {
      const prevData = apiUtils.album.albumPageGetOne.getData();

      const updatedEntities = getReorderedEntities({
        active: activeAlbumImage,
        over: overAlbumImage,
        entities: albumImages,
      });

      apiUtils.album.albumPageGetOne.setData(
        { albumId: album.id },
        (currData) => {
          if (!currData) {
            return prevData;
          }

          const updatedData = produce(currData, (draft) => {
            const updatedImages = currData.images
              .map((albumImage) =>
                !mapIds(updatedEntities).includes(albumImage.id)
                  ? albumImage
                  : {
                      ...albumImage,
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      index: updatedEntities.find(
                        ({ id }) => id === albumImage.id
                      )!.index,
                    }
              )
              .sort(sortByIndex);

            draft.images = updatedImages;
          });

          return updatedData;
        }
      );

      return { prevData };
    },
    onError(_err, _mutationArgs, ctx) {
      if (!ctx?.prevData) {
        return;
      }
      apiUtils.album.albumPageGetOne.setData(
        { albumId: album.id },
        ctx.prevData
      );

      toast(<Toast text="Error reordering albums" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <DndSortableContext
      elementIds={mapIds(album.images)}
      onReorder={({ activeId, overId }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeAlbum = findEntityById(album.images, activeId)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overAlbum = findEntityById(album.images, overId)!;

        const noChange = activeAlbum.id === overAlbum.id;

        if (noChange) {
          return;
        }

        reorderMutation.mutate({
          activeAlbumImage: {
            id: activeId,
            index: activeAlbum.index,
          },
          albumImages: album.images.map((albumImage) => ({
            id: albumImage.id,
            index: albumImage.index,
          })),
          overAlbumImage: {
            id: overId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            index: overAlbum.index,
          },
        });
      }}
    >
      {children}
    </DndSortableContext>
  );
};
