import { useState, useRef, type ReactElement } from "react";

import { AlbumProvider, useAlbumContext } from "~/context/AlbumState";
import { api } from "~/utils/api";
import CoverImage from "~/components/pages/albums/cover-image";
import TextInput from "~/components/forms/TextInput";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import { UploadModalVisibilityProvider } from "~/context/UploadModalVisibilityState";
import { UploadedModalVisibilityProvider } from "~/context/UploadedModalVisibilityState";
// import UploadModal from "~/components/image/add-image/upload-modal";
import UploadedModal from "~/components/image/add-image/uploaded-modal";
import { AlbumsProvider, useAlbumsContext } from "~/context/AlbumsState";
import UploadModal from "~/components/image/add-image/upload-modal";
import AlbumMenu from "./album/Menu";
import { WarningModalProvider } from "~/components/warning-modal/Context";
import WarningModal from "~/components/warning-modal";
import AddAlbumModal, { AddAlbumModalButton } from "./AddAlbumModal";
import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import { getReorderedEntities, mapIds } from "~/helpers/process-data";
import DndSortableElement from "~/components/dnd-kit/DndSortableElement";

// edit title + subtitle of page

// test album title has to be unique (as defined on prisma)

// show  published status
// show date created?

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
          {({ setActiveAlbumId }) => (
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
  const activeAlbum = useAlbumsContext();

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
    activeAlbum.activeAlbumId &&
    updateCoverImageMutation.mutate({
      albumId: activeAlbum.activeAlbumId,
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
    activeAlbum.activeAlbumId &&
    createDbImageAndAddToAlbumMutation.mutate(
      {
        albumId: activeAlbum.activeAlbumId,
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
          activeAlbum.activeAlbumId &&
          deleteAlbumMutation.mutate(
            { albumId: activeAlbum.activeAlbumId },
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
    /*     onMutate: async ({ activeAlbum, albums, overAlbum }) => {
      await utils.album.getAll.cancel();

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

        const updatedData = currData.map((album) =>
          !mapIds(updatedEntities).includes(album.id)
            ? album
            : {
                ...album,
                index: updatedEntities.find(({ id }) => id === album.id)!.index,
              }
        );

        console.log("updatedData:", updatedData);

        return updatedData;
      });

      return prevData;
    }, */
    onSuccess: async () => {
      await refetchAlbums();
      toast(<Toast text="Albums reordered" type="success" />);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-xl">
      <DndSortableContext
        elementIds={mapIds(albums)}
        onReorder={({ activeId, overId }) =>
          reOrder.mutate({
            activeAlbum: {
              id: activeId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              index: albums.find((album) => album.id === activeId)!.index,
            },
            albums: albums.map((album) => ({
              id: album.id,
              index: album.index,
            })),
            overAlbum: {
              id: overId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              index: albums.find((album) => album.id === overId)!.index,
            },
          })
        }
      >
        {albums?.map((album) => (
          <DndSortableElement elementId={album.id} key={album.id}>
            <AlbumProvider album={album}>
              <Album />
            </AlbumProvider>
          </DndSortableElement>
        ))}
      </DndSortableContext>
    </div>
  );
};

const Album = () => {
  return (
    <div className="group/album relative rounded-lg border border-transparent p-sm transition-colors duration-75 ease-in-out focus-within:border-base-300 hover:border-base-200">
      <AlbumMenu />
      <AlbumTitleInput />
      <CoverImage />
    </div>
  );
};

const AlbumTitleInput = () => {
  const album = useAlbumContext();

  const [inputText, setInputText] = useState(album.title);

  const prevTitleValueRef = useRef(album.title);
  const prevTitleValue = prevTitleValueRef.current;
  const isChange = prevTitleValue !== inputText;

  const {
    refetch: checkTitleIsUnique,
    data: titleIsUnique,
    // isFetching: isFetchingCheckTitleIsUnique,
  } = api.album.checkTitleIsUnique.useQuery(
    { title: inputText },
    { enabled: false }
  );

  const { refetch: refetchAlbums } = api.album.getAll.useQuery(undefined, {
    enabled: false,
  });

  const updateTitle = api.album.updateTitle.useMutation();

  const handleSubmit = async () => {
    if (!isChange) {
      return;
    }

    const { data: titleIsUnique } = await checkTitleIsUnique();

    if (!titleIsUnique) {
      return;
    }

    updateTitle.mutate(
      { albumId: album.id, updatedTitle: inputText },
      {
        onSuccess: () => {
          prevTitleValueRef.current = inputText;
          toast(<Toast text="Title updated" type="success" />);
          void refetchAlbums();
        },
      }
    );
  };

  const isError = titleIsUnique === false;

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      ref={containerRef}
    >
      <div className="form-control w-full max-w-xs">
        <TextInput
          setValue={(value) => setInputText(value)}
          value={inputText}
          placeholder="Album title"
          inputAdditionalClasses="font-bold text-lg text-black uppercase"
          wrapperAdditionalClasses={`${
            !isError ? "" : "border border-my-error-content"
          }`}
          showPressEnter
          isChange={isChange}
        />
        <label className="label">
          {titleIsUnique === false ? (
            <span className="label-text-alt text-my-error-content">
              Title is already used. Album titles must be unique.
            </span>
          ) : null}
        </label>
        {/*         {isFetchingCheckTitleIsUnique ? (
          <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-gray-100 bg-opacity-70">
            <p className="loading">Checking...</p>
          </div>
        ) : null} */}
      </div>
    </form>
  );
};
