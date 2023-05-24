import { type ReactElement } from "react";

import { api } from "~/utils/api";
import { AlbumProvider } from "~/components/+my-pages/albums/_context";
import {
  CollapsableSection,
  DataTextInputForm,
  DndKit,
} from "~/components/ui-compounds";
import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query-data";
import { useAdmin, useToast } from "~/hooks";
import Album from "./album/+Entry";

const Populated = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  return (
    <>
      <Titles />
      <div className="mt-lg grid grid-cols-2 gap-xl">
        <DndSortableWrapper>
          {albums.map((album) => (
            <AlbumProvider album={album} key={album.id}>
              <Album />
            </AlbumProvider>
          ))}
        </DndSortableWrapper>
      </div>
    </>
  );
};

export default Populated;

const Titles = () => (
  <>
    <Title />
    <CollapsableSection
      margin={{ bottom: { open: 10 } }}
      showSectionText="Show subtitle"
    >
      <SubTitle />
    </CollapsableSection>
  </>
);

const Title = () => {
  const { data } = api.albumsPage.getText.useQuery(undefined, {
    enabled: false,
  });
  const pageText = data as NonNullable<typeof data>;

  const toast = useToast();

  const updateTitleMutation = api.albumsPage.updateTitle.useMutation({
    onSuccess() {
      toast.success("Title updated");
    },
    onError() {
      toast.error("Something went wrong updating the title");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <div className="text-6xl tracking-wider">
      <DataTextInputForm
        input={{ initialValue: pageText.title, placeholder: "Page title..." }}
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() =>
            updateTitleMutation.mutate(
              { data: { text: inputValue } },
              { onSuccess },
            ),
          )
        }
        tooltip={{ text: "click to update page title" }}
      />
    </div>
  );
};

const SubTitle = () => {
  const { data } = api.albumsPage.getText.useQuery(undefined, {
    enabled: false,
  });
  const pageText = data as NonNullable<typeof data>;

  const toast = useToast();

  const updateTitleMutation = api.albumsPage.updateSubTitle.useMutation({
    onSuccess() {
      toast.success("Subtitle updated");
    },
    onError() {
      toast.error("Something went wrong updating the subtitle");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <div className="text-2xl">
      <DataTextInputForm
        input={{
          initialValue: pageText.subTitle,
          placeholder: "Page subtitle (optional)...",
        }}
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() =>
            updateTitleMutation.mutate(
              { data: { text: inputValue } },
              { onSuccess },
            ),
          )
        }
        tooltip={{ text: "click to update page subtitle" }}
      />
    </div>
  );
};

const DndSortableWrapper = ({ children }: { children: ReactElement[] }) => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

  const toast = useToast();

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

      toast.error("Error reordering albums");
    },
    onSuccess() {
      toast.success("Albums reordered");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <DndKit.Context
      elementIds={mapIds(albums)}
      onReorder={({ activeId, overId }) =>
        ifAdmin(() => {
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
        })
      }
    >
      {children}
    </DndKit.Context>
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
