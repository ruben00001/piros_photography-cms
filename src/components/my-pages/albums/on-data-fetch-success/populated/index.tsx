import { type ReactElement } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/data-display/Toast";
import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import { AlbumProvider } from "~/components/my-pages/albums/_context";
import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import AddAlbum from "./AddAlbum";
import Album from "./album";

const Populated = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  return (
    <div>
      <div className="max-w-[400px]">
        <AddAlbum />
      </div>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        <DndSortableWrapper>
          {albums.map((album) => (
            <AlbumProvider album={album} key={album.id}>
              <Album />
            </AlbumProvider>
          ))}
        </DndSortableWrapper>
      </div>
    </div>
  );
};

export default Populated;

const DndSortableWrapper = ({ children }: { children: ReactElement[] }) => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

  const reorderMutation = api.album.reorder.useMutation({
    onMutate: ({ activeAlbum, albums, overAlbum }) => {
      const prevData = apiUtils.album.albumsPageGetAll.getData();

      const updatedEntities = getReorderedEntities({
        active: activeAlbum,
        over: overAlbum,
        entities: albums,
      });

      apiUtils.album.albumsPageGetAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = currData
          .map((album) =>
            !mapIds(updatedEntities).includes(album.id)
              ? album
              : {
                  ...album,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  index: updatedEntities.find(({ id }) => id === album.id)!
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
      apiUtils.album.albumsPageGetAll.setData(undefined, ctx.prevData);

      toast(<Toast text="Error reordering albums" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <DndSortableContext
      elementIds={mapIds(albums)}
      onReorder={({ activeId, overId }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeAlbum = findEntityById(albums, activeId)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overAlbum = findEntityById(albums, overId)!;

        const noChange = activeAlbum.id === overAlbum.id;

        if (noChange) {
          return;
        }

        reorderMutation.mutate({
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
      {children}
    </DndSortableContext>
  );
};

// Attempted to create albums copy but maybe not optimal way. Could create an array and sort albums directly?
/* const DndSortableWrapper = ({ children }: { children: ReactElement[] }) => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  const [albumsCopy, setAlbumsCopy] = useState(albums);

  const reorderAlbumsCopy = z
    .function()
    .args(
      z.object({
        activeAlbum: z.object({ id: z.string(), index: z.number() }),
        overAlbum: z.object({ id: z.string(), index: z.number() }),
      })
    )
    .implement(({ activeAlbum, overAlbum }) => {
      const reorderedAlbums = getReorderedEntities({
        active: activeAlbum,
        over: overAlbum,
        entities: albums,
      });

      const updatedData = albumsCopy
        .map((album) =>
          !mapIds(reorderedAlbums).includes(album.id)
            ? album
            : {
                ...album,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                index: reorderedAlbums.find(({ id }) => id === album.id)!.index,
              }
        )
        .sort(sortByIndex);

      setAlbumsCopy(updatedData)
    });

  const apiUtils = api.useContext();

  const reorderMutation = api.album.reorder.useMutation({
    onMutate: ({ activeAlbum, albums, overAlbum }) => {
      const prevData = apiUtils.album.albumsPageGetAll.getData();

      const updatedEntities = getReorderedEntities({
        active: activeAlbum,
        over: overAlbum,
        entities: albums,
      });

      apiUtils.album.albumsPageGetAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = currData
          .map((album) =>
            !mapIds(updatedEntities).includes(album.id)
              ? album
              : {
                  ...album,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      setAlbumsCopy(ctx.prevData);
      apiUtils.album.albumsPageGetAll.setData(undefined, ctx.prevData);

      toast(<Toast text="Error reordering albums" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <DndSortableContext
      elementIds={mapIds(albums)}
      onReorder={({ activeId, overId }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeAlbum = findEntityById(albums, activeId)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overAlbum = findEntityById(albums, overId)!;

        const noChange = activeAlbum.id === overAlbum.id;

        if (noChange) {
          return;
        }

        reorderAlbumsCopy()

        reorderMutation.mutate({
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
      {children}
    </DndSortableContext>
  );
};
 */
