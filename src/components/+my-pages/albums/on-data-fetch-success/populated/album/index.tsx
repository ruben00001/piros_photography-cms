import Link from "next/link";
import produce from "immer";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/albums/_context";
import { DataTextInputForm, DndKit } from "~/components/ui-compounds";
import { MyToast, WithTooltip } from "~/components/ui-display";
import { GoToPageIcon } from "~/components/ui-elements/Icon";
import CoverImage from "./CoverImage";
import AlbumMenu from "./Menu";

const Album = () => {
  const album = useAlbumContext();

  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  return (
    <DndKit.Element elementId={album.id}>
      <div className="group/album relative" ref={containerRef}>
        {containerWidth ? (
          <>
            <DraftBadge />
            <TitleInput />
            <CoverImage containerWidth={containerWidth} />
            <GoToPage />
            <AlbumMenu />
          </>
        ) : null}
      </div>
    </DndKit.Element>
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
            (draftAlbum) => draftAlbum.id === mutationInput.albumId,
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
      toast(<MyToast text="Error updating title" type="error" />);
    },
    onSuccess: () => {
      toast(<MyToast text="Title updated" type="success" />);
    },
  });

  return (
    <div className="mb-xs text-2xl">
      <DataTextInputForm
        onSubmit={({ inputValue, onSuccess }) =>
          updateTitle.mutate(
            { albumId: album.id, updatedTitle: inputValue },
            { onSuccess },
          )
        }
        input={{ initialValue: album.title, placeholder: "Album title..." }}
        tooltip={{ text: "click to edit title" }}
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
        <div className="flex items-center gap-xs">
          <span className="text-mid text-secondary">
            <GoToPageIcon />
          </span>
          <span className=" text-sm text-gray-400">Go to album</span>
        </div>
      </div>
    </Link>
  );
};
