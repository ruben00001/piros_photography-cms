import produce from "immer";
import Link from "next/link";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import { TextInputForm } from "~/components/forms/TextInputFormDynamic";
import { GoToPageIcon } from "~/components/Icon";
import { api } from "~/utils/api";
import { useAlbumContext } from "../_context/AlbumState";
import AlbumMenu from "./AlbumMenu";
import CoverImage from "./CoverImage";

const Album = () => {
  return (
    <div className="group/album relative">
      <DraftBadge />
      <TitleInput />
      <CoverImage />
      <GoToPage />
      <AlbumMenu />
    </div>
  );
};

export default Album;

const TitleInput = () => {
  const album = useAlbumContext();

  const apiUtils = api.useContext();

  const updateTitle = api.album.updateTitle.useMutation({
    async onMutate(mutationInput) {
      const prevData = apiUtils.album.albumsPageGetAll.getData();

      await apiUtils.album.albumsPageGetAll.cancel();

      apiUtils.album.albumsPageGetAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = produce(currData, (draft) => {
          const albumIndex = draft.findIndex(
            (draftAlbum) => draftAlbum.id === mutationInput.albumId
          );
          const draftAlbum = draft[albumIndex];

          if (!draftAlbum) {
            return;
          }

          draftAlbum.title === mutationInput.updatedTitle;
        });

        return updatedData;
      });
    },
    onError: () => {
      toast(<Toast text="Error updating title" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Title updated" type="success" />);
    },
  });

  return (
    <div className="mb-xs text-2xl">
      <TextInputForm
        onSubmit={({ inputValue }) =>
          updateTitle.mutate({ albumId: album.id, updatedTitle: inputValue })
        }
        tooltipText="click to edit title"
        initialValue={album.title}
        placeholder="Album title"
      />
    </div>
  );
};

const DraftBadge = () => {
  const album = useAlbumContext();

  if (album.published) {
    return null;
  }

  return (
    <WithTooltip text="This album isn't published">
      <p
        className={`mb-sm inline-block cursor-help rounded-lg bg-gray-100 px-xs py-xxxs text-sm tracking-wide text-base-content`}
      >
        draft
      </p>
    </WithTooltip>
  );
};

const GoToPage = () => {
  const album = useAlbumContext();

  return (
    <Link href={`/albums/${album.id}`} passHref>
      <div className="mt-sm inline-block cursor-pointer rounded-sm border border-transparent py-xxxs px-xxs opacity-0 transition-all duration-150 ease-in-out hover:border-gray-200 hover:bg-gray-100 group-hover/album:opacity-100">
        <div className="flex items-center gap-xs text-xs text-gray-500">
          <span>
            <GoToPageIcon />
          </span>
          <span className="uppercase text-gray-500">Go to album</span>
        </div>
      </div>
    </Link>
  );
};
