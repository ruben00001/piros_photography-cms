import { toast } from "react-toastify";

import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";
import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import { AddFirstAlbumIcon } from "~/components/Icon";
import { AddAlbumModalButton } from "./AddAlbumModal";
import Album from "./album";

const Albums = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  return <div>{!albums.length ? <Empty /> : <Populated />}</div>;
};

export default Albums;

const Empty = () => {
  return (
    <div className="grid place-items-center">
      <div className="mb-xs text-4xl text-gray-300">
        <AddFirstAlbumIcon weight="light" />
      </div>
      <h5 className="font-bold">No albums</h5>
      <p className="mt-xs mb-sm text-gray-500">Create first album</p>
      <AddAlbumModalButton />
    </div>
  );
};

const Populated = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  const utils = api.useContext();

  const reOrder = api.album.reorder.useMutation({
    onMutate: ({ activeAlbum, albums, overAlbum }) => {
      const prevData = utils.album.albumsPageGetAll.getData();

      const updatedEntities = getReorderedEntities({
        active: activeAlbum,
        over: overAlbum,
        entities: albums,
      });

      utils.album.albumsPageGetAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = currData
          .map((album) =>
            !mapIds(updatedEntities).includes(album.id)
              ? album
              : {
                  ...album,
                  index: updatedEntities.find(({ id }) => id === album.id)!
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
      utils.album.albumsPageGetAll.setData(undefined, ctx.prevData);
    },
    onSuccess: async () => {
      utils.album.albumsPageGetAll.invalidate();
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <div>
      <div>
        <AddAlbumModalButton />
      </div>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        <DndSortableContext
          elementIds={mapIds(albums)}
          onReorder={({ activeId, overId }) => {
            const activeAlbum = findEntityById(albums, activeId)!;
            const overAlbum = findEntityById(albums, overId)!;

            const noChange = activeAlbum.id === overAlbum.id;

            if (noChange) {
              return;
            }

            reOrder.mutate({
              activeAlbum: {
                id: activeId,
                index: activeAlbum.index,
              },
              albums: albums.map((album) => ({
                id: album.id,
                index: album.index,
              })),
              overAlbum: {
                id: overId,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                index: overAlbum.index,
              },
            });
          }}
        >
          {albums?.map((album) => (
            <Album album={album} key={album.id} />
          ))}
        </DndSortableContext>
      </div>
    </div>
  );
};
