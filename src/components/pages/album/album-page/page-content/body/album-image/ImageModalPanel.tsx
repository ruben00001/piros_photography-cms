import produce from "immer";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import TextInput from "~/components/forms/TextInput";
import TextInputDynamicWidth from "~/components/forms/TextInputDynamicWidth";
import { TextInputForm } from "~/components/forms/TextInputFormDynamic";
import { CycleLeftIcon, CycleRightIcon, LikeIcon } from "~/components/Icon";

import MyCldImage from "~/components/image/MyCldImage2";
import { useModalVisibilityContext } from "~/components/modal";
// import { TextInputForm } from "~/components/TextInputForm";
import { api } from "~/utils/api";
import { useAlbumImageContext } from "../../../_context/AlbumImageState";
import { useAlbumContext } from "../../../_context/AlbumState";

const ImageModalPanel = () => {
  const { imageDimensionsForScreen } = useAlbumImageContext();

  const imageIsLandscape =
    imageDimensionsForScreen.width > imageDimensionsForScreen.height;

  return (
    <>
      <CloseButton />
      <div
        className={`group/imageModal flex gap-sm ${
          imageIsLandscape ? "flex-col" : "flex-row-reverse"
        }`}
      >
        <ImagePanel />
        <DescriptionPanel />
        <CycleImagesButtons />
      </div>
    </>
  );
};

export default ImageModalPanel;

const CloseButton = () => {
  const { close: closeModal } = useModalVisibilityContext();

  return createPortal(
    <button
      className="fixed top-sm right-sm z-50 text-sm tracking-wide"
      onClick={closeModal}
      type="button"
    >
      close
    </button>,
    document.body
  );
};

const DescriptionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { imageDimensionsForScreen } = useAlbumImageContext();

  return (
    <div className="text-gray-900">
      <div
        className={`flex items-center justify-between`}
        style={{ width: imageDimensionsForScreen.width }}
      >
        <div className="flex gap-xl">
          <Title />
          <button
            className="flex items-center gap-xs text-xs text-gray-500"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <span>read {isExpanded ? "less" : "more"}</span>
          </button>
        </div>
        <div className="flex items-center gap-xs text-gray-600">
          <div className="text-lg">
            <LikeIcon />
          </div>
          <div className="">11</div>
        </div>
      </div>
      <div
        className={`max-h-[200px] overflow-y-auto transition-opacity duration-150 ease-linear ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-serif tracking-wide">
          Quisque vitae dolor tincidunt, ornare diam tincidunt, feugiat tellus.
          Proin placerat tellus non vehicula vulputate. Aliquam faucibus felis
          ut eros consectetur semper. Donec volutpat tellus dapibus quam mollis
          varius. Donec bibendum erat in rutrum rhoncus. Aenean ut ante massa.
          Fusce ultricies ultrices mi, ac volutpat quam bibendum quis.
        </p>
        <p className="mt-sm font-mono text-sm text-base-content">
          [ Comments will go here ]
        </p>
      </div>
    </div>
  );
};

const Title = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const utils = api.useContext();

  const updateTitleMutation = api.albumImage.updateTitle.useMutation({
    async onMutate({ albumImageId, updatedTitle }) {
      const prevData = utils.album.albumPageGetOne.getData();

      await utils.album.albumPageGetOne.cancel();

      utils.album.albumPageGetOne.setData({ albumId: album.id }, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updated = produce(currData, (draft) => {
          const albumImageIndex = draft.images.findIndex(
            (albumImage) => albumImage.id === albumImageId
          );
          if (albumImageIndex > -1) {
            draft.images[albumImageIndex]!.title = updatedTitle;
          }
        });

        return updated;
      });
    },
    onSuccess: () => {
      toast(<Toast text="Title updated" type="success" />);
    },
    onError: () => {
      toast(
        <Toast text="Something went wrong updating the title" type="error" />
      );
    },
  });

  return (
    <TextInputForm
      onSubmit={({ inputValue }) =>
        updateTitleMutation.mutate({
          albumImageId: albumImage.id,
          updatedTitle: inputValue,
        })
      }
      tooltipText="Click to update title"
      initialValue={albumImage.title}
      placeholder="Title"
    />
    /*     <TextInputForm
      onSubmit={({ inputValue }) =>
        updateTitleMutation.mutate({
          albumImageId: albumImage.id,
          updatedTitle: inputValue,
        })
      }
      tooltipText="Click to update title"
      initialValue={albumImage.title}
      placeholder="Title"
    /> */
  );
};

const ImagePanel = () => {
  const { image, imageDimensionsForScreen } = useAlbumImageContext();

  return (
    <MyCldImage
      src={image.cloudinary_public_id}
      dimensions={imageDimensionsForScreen}
    />
  );
};

const CycleImagesButtons = () => {
  return (
    <>
      <button
        className="absolute left-sm top-1/2 z-10 -translate-y-1/2 text-4xl opacity-0 transition-opacity duration-150 ease-in-out group-hover/imageModal:opacity-100"
        type="button"
      >
        <CycleLeftIcon weight="duotone" color="white" fill="gray" />
      </button>
      <button
        className="absolute right-sm top-1/2 z-10 -translate-y-1/2 text-4xl opacity-0 transition-opacity duration-150 ease-in-out group-hover/imageModal:opacity-100"
        type="button"
      >
        <CycleRightIcon weight="duotone" color="white" fill="black" />
      </button>
    </>
  );
};
