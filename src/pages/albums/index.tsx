import { type FormEvent, useState, useRef } from "react";

import { AlbumProvider, useAlbumContext } from "~/context/AlbumState";
import { api } from "~/utils/api";
import CoverImage from "~/components/pages/albums/cover-image";
import TextInput from "~/components/forms/TextInput";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";

// edit title + subtitle of page

// test album title has to be unique (as defined on prisma)

// show  published status
// show date created?

const Albums = () => {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.album.getAll.useQuery();

  return (
    <div className="p-8">
      {isInitialLoading ? (
        <Loading />
      ) : !isFetchedAfterMount && isError ? (
        <InitialLoadingError />
      ) : (
        <OnInitialSuccessContent />
      )}
    </div>
  );
};

export default Albums;

const Loading = () => {
  return <div className="loading">Loading...</div>;
};

const InitialLoadingError = () => {
  return <div>Initial loading error</div>;
};

const OnInitialSuccessContent = () => {
  return (
    <div>
      <AddAlbumModal />
      <div className="mt-8">
        <FetchedAlbums />
      </div>
    </div>
  );
};

const FetchedAlbums = () => {
  const { data: albums } = api.album.getAll.useQuery();

  return (
    <div>
      {!albums?.length ? <FetchedAlbumsEmpty /> : <FetchedAlbumsPopulated />}
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

  return (
    <div className="grid grid-cols-2 gap-xl">
      {albums?.map((album) => (
        <AlbumProvider album={album} key={album.id}>
          <Album />
        </AlbumProvider>
      ))}
    </div>
  );
};

const Album = () => {
  return (
    <div className="rounded-lg border border-transparent p-sm  transition-colors duration-75 ease-in-out focus-within:border-base-300 hover:border-base-300">
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

const AddAlbumModal = () => {
  return (
    <>
      <label htmlFor="my-modal-4" className="btn">
        add album
      </label>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <AddAlbumModalContent />
      </label>
    </>
  );
};

// optional cover image on create

const AddAlbumModalContent = () => {
  return (
    <label className="modal-box relative" htmlFor="">
      <h3 className="text-lg font-bold">Add album</h3>
      <AddAlbumModalForm />
    </label>
  );
};

const AddAlbumModalForm = () => {
  const [inputText, setInputText] = useState("");

  const {
    refetch: checkTitleIsUnique,
    data: titleIsUnique,
    isFetching: isFetchingCheckTitleIsUnique,
  } = api.album.checkTitleIsUnique.useQuery(
    { title: inputText },
    { enabled: false }
  );

  const isError = titleIsUnique === false;

  const { refetch: refetchAlbums } = api.album.getAll.useQuery();

  const createAlbum = api.album.create.useMutation({
    onSuccess: () => {
      void refetchAlbums();
    },
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: titleIsUnique } = await checkTitleIsUnique();

    if (!titleIsUnique) {
      return;
    }

    createAlbum.mutate({ title: inputText });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit}>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text"></span>
          <span className="label-text text-xs uppercase text-info">
            album title
          </span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className={`minput-bordered input-bordered input w-full max-w-xs ${
            !isError ? "" : "input-error"
          }`}
          onChange={(e) => setInputText(e.currentTarget.value)}
          value={inputText}
          required
        />
        <label className="label">
          {titleIsUnique === false ? (
            <span className="label-text-alt text-error">
              Title is already used. Album titles must be unique.
            </span>
          ) : null}
        </label>
        {isFetchingCheckTitleIsUnique ? (
          <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-gray-100 bg-opacity-70">
            <p className="loading">Checking...</p>
          </div>
        ) : null}
      </div>
    </form>
  );
};
