import { Album } from "@prisma/client";
import { type FormEvent, useState } from "react";
import CoverImage from "~/components/pages/albums/cover-image";
import { api } from "~/utils/api";

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
  console.log("albums:", albums);

  return (
    <div className="grid grid-cols-2 gap-4">
      {albums?.map((album) => (
        <Album album={album} key={album.id} />
      ))}
    </div>
  );
};

const Album = ({ album }: { album: Album }) => {
  return (
    <div className="border p-4">
      {/* <h2>{album.title}</h2> */}
      <AlbumTitleInput albumId={album.id} albumTitle={album.title} />
      <CoverImage />
    </div>
  );
};

const AlbumTitleInput = ({
  albumId,
  albumTitle,
}: {
  albumId: string;
  albumTitle: string;
}) => {
  const [inputText, setInputText] = useState(albumTitle);

  const {
    refetch: checkTitleIsUnique,
    data: titleIsUnique,
    isFetching: isFetchingCheckTitleIsUnique,
  } = api.album.checkTitleIsUnique.useQuery(
    { title: inputText },
    { enabled: false }
  );

  const updateTitle = api.album.updateTitle.useMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: titleIsUnique } = await checkTitleIsUnique();

    if (!titleIsUnique) {
      return;
    }

    updateTitle.mutate({ albumId, updatedTitle: inputText });
  };

  const isError = titleIsUnique === false;

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className="relative" onSubmit={onSubmit}>
      <div className="form-control w-full max-w-xs">
        <input
          type="text"
          placeholder="Album title"
          className={`input pl-0 ${!isError ? "" : "input-error"}`}
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
