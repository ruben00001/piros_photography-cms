import { type ReactElement } from "react";
import produce from "immer";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import {
  AlbumImageProvider,
  useAlbumContext,
} from "~/components/+my-pages/album/_context";
import { DndKit } from "~/components/ui-compounds";
import { MyToast } from "~/components/ui-display";
import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import useIsAdmin from "~/hooks/useIsAdmin";
import AlbumImage from "./image/+Entry";

const Populated = () => {
  const album = useAlbumContext();

  return (
    <>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        <ImagesDndSortableContext>
          {album.images.map((albumImage) => (
            <DndKit.Element elementId={albumImage.id} key={albumImage.id}>
              <AlbumImageProvider albumImage={albumImage}>
                <AlbumImage />
              </AlbumImageProvider>
            </DndKit.Element>
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
                        ({ id }) => id === albumImage.id,
                      )!.index,
                    },
              )
              .sort(sortByIndex);

            draft.images = updatedImages;
          });

          return updatedData;
        },
      );

      return { prevData };
    },
    onError(_err, _mutationArgs, ctx) {
      if (!ctx?.prevData) {
        return;
      }
      apiUtils.album.albumPageGetOne.setData(
        { albumId: album.id },
        ctx.prevData,
      );

      toast(<MyToast text="Error reordering albums" type="error" />);
    },
    onSuccess: () => {
      toast(<MyToast text="Albums reordered" type="success" />);
    },
  });

  const isAdmin = useIsAdmin();

  return (
    <DndKit.Context
      elementIds={mapIds(album.images)}
      onReorder={({ activeId, overId }) => {
        if (!isAdmin) {
          return;
        }

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
    </DndKit.Context>
  );
};
