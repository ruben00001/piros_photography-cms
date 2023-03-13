import { type ReactElement } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/data-display/Toast";
import { UploadModalVisibilityProvider } from "~/context/UploadModalVisibilityState";
import { UploadedModalVisibilityProvider } from "~/context/UploadedModalVisibilityState";
import UploadedModal from "~/components/image/add-image/uploaded-modal";
import { AlbumsProvider, useAlbumsContext } from "~/context/AlbumsState";
import UploadModal from "~/components/image/add-image/upload-modal";
import { WarningModalProvider } from "~/components/warning-modal/Context";
import WarningModal from "~/components/warning-modal";
import AddAlbumModal, { AddAlbumModalButton } from "./AddAlbumModal";
import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import {
  getReorderedEntities,
  mapIds,
  sortByIndex,
} from "~/helpers/process-data";
import { findEntityById } from "~/helpers/query";
import Album from "./album";

const PageBody = () => {
  return (
    <div className="p-8">
      <InitialFetchStatusWrapper>
        <PageSuccessContentWrapper>
          <PageSuccessContent />
        </PageSuccessContentWrapper>
      </InitialFetchStatusWrapper>
    </div>
  );
};

export default PageBody;

const InitialFetchStatusWrapper = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.album.getAll.useQuery();

  return (
    <div className="p-8">
      {isInitialLoading ? (
        <Loading />
      ) : !isFetchedAfterMount && isError ? (
        <InitialLoadingError />
      ) : (
        children
      )}
    </div>
  );
};

const Loading = () => {
  return <div className="loading">Loading...</div>;
};

const InitialLoadingError = () => {
  return <div>Initial loading error</div>;
};

const PageSuccessContentWrapper = ({
  children,
}: {
  children: ReactElement;
}) => {
  return (
    <UploadModalVisibilityProvider>
      <UploadedModalVisibilityProvider>
        <AlbumsProvider>
          {({ setActiveAlbum: setActiveAlbumId }) => (
            <WarningModalProvider onClose={() => setActiveAlbumId(null)}>
              {children}
            </WarningModalProvider>
          )}
        </AlbumsProvider>
      </UploadedModalVisibilityProvider>
    </UploadModalVisibilityProvider>
  );
};

const PageSuccessContent = () => {
  const { activeAlbum } = useAlbumsContext();

  const { refetch: refetchAlbums } = api.album.getAll.useQuery(undefined, {
    enabled: false,
  });

  const updateCoverImageMutation = api.album.updateCoverImage.useMutation({
    onSuccess: async () => {
      toast(<Toast text="updated album cover image" type="success" />);
      // better flow would be to indicate refetch pending on actual album
      await refetchAlbums();
    },
  });

  const updateCoverImage = (imageId: string) =>
    activeAlbum &&
    updateCoverImageMutation.mutate({
      albumId: activeAlbum.id,
      imageId,
    });

  const createDbImageAndAddToAlbumMutation =
    api.imageAndAlbumTransaction.createImageAndAddToAlbum.useMutation({
      onSuccess: async () => {
        await refetchAlbums();
      },
    });

  const createDbImageAndAddToAlbum = ({
    cloudinary_public_id,
    tagIds,
    onSuccess,
  }: {
    cloudinary_public_id: string;
    tagIds?: string[];
    onSuccess: () => void;
  }) =>
    activeAlbum &&
    createDbImageAndAddToAlbumMutation.mutate(
      {
        albumId: activeAlbum.id,
        cloudinary_public_id,
        tagIds,
      },
      { onSuccess }
    );

  const deleteAlbumMutation = api.album.delete.useMutation({
    onSuccess: async () => {
      await refetchAlbums();
    },
  });

  return (
    <>
      <div>
        <AddAlbumModalButton />
        <div className="mt-8">
          <FetchedAlbums />
        </div>
      </div>
      <AddAlbumModal />
      <UploadedModal onSelectImage={updateCoverImage} />
      <UploadModal createDbImageFunc={createDbImageAndAddToAlbum} />
      <WarningModal
        text={{
          body: "Are you sure? This can't be undone.",
          title: "Delete album",
        }}
        onConfirm={({ closeModal }) =>
          activeAlbum &&
          deleteAlbumMutation.mutate(
            { album: { id: activeAlbum.id, index: activeAlbum.index } },
            {
              onSuccess: () => {
                setTimeout(() => {
                  deleteAlbumMutation.reset();
                  closeModal();
                }, 600);
                setTimeout(() => {
                  toast(<Toast text="Album deleted" type="success" />);
                }, 750);
              },
            }
          )
        }
        invokedFuncStatus={deleteAlbumMutation.status}
      />
    </>
  );
};

const FetchedAlbums = () => {
  const { data: albums } = api.album.getAll.useQuery();

  if (!albums) {
    return <p>Something went wrong</p>;
  }

  return (
    <div>
      {!albums.length ? <FetchedAlbumsEmpty /> : <FetchedAlbumsPopulated />}
    </div>
  );
};

const FetchedAlbumsEmpty = () => {
  return (
    <div>
      <div>No albums yet</div>
      <div>
        <AddAlbumModal />
      </div>
    </div>
  );
};

const FetchedAlbumsPopulated = () => {
  const { data: albums } = api.album.getAll.useQuery();

  if (!albums) {
    return <p>Something went wrong</p>;
  }

  const { refetch: refetchAlbums } = api.album.getAll.useQuery(undefined, {
    enabled: false,
  });

  const utils = api.useContext();

  const reOrder = api.album.reorder.useMutation({
    // TODO: below not working updating state
    onMutate: ({ activeAlbum, albums, overAlbum }) => {
      // await utils.album.getAll.cancel();

      const prevData = utils.album.getAll.getData();

      const updatedEntities = getReorderedEntities({
        active: activeAlbum,
        over: overAlbum,
        entities: albums,
      });

      utils.album.getAll.setData(undefined, (currData) => {
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
      utils.album.getAll.setData(undefined, ctx.prevData);
    },
    onSuccess: async () => {
      utils.album.getAll.invalidate();
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-xl">
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
  );
};
