import produce from "immer";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import { useAlbumContext, useAlbumImageContext } from "~/album-page/_context";
import { api } from "~/utils/api";
import { calcImageDimensionsToFitToScreen } from "~/helpers/general";

import Toast from "~/components/data-display/Toast";
import { TextInputForm } from "~/components/forms/TextInputFormDynamic";
import { CycleLeftIcon, CycleRightIcon } from "~/components/Icon";
import MyCldImage from "~/components/image/MyCldImage";
import { useModalVisibilityContext } from "~/components/modal";
import TextAreaForm from "~/components/forms/TextAreaForm";

const OpenedImagePanel = () => {
  return (
    <>
      <CloseButton />
      <div className={`group/imageModal`}>
        <ImagePanel />
        <DescriptionPanel />
        <CycleImagesButtons />
      </div>
    </>
  );
};

export default OpenedImagePanel;

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

  const { image } = useAlbumImageContext();

  const imageDimensionsForScreen = calcImageDimensionsToFitToScreen({
    height: image.naturalHeight,
    width: image.naturalWidth,
  });

  return (
    <div
      className={`text-gray-900`}
      // style={{ maxWidth: "23vw" }}
    >
      <div
        className={`flex items-center justify-between`}
        style={{
          width: imageDimensionsForScreen.width,
        }}
      >
        <div className={`flex gap-xl `}>
          <div className="text-gray-900">
            <Title />
          </div>
          <button
            className="flex items-center gap-xs whitespace-nowrap text-xs text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <span>read {isExpanded ? "less" : "more"}</span>
          </button>
        </div>
      </div>
      <div
        className={`overflow-y-auto pb-md text-gray-900 transition-opacity duration-150  ease-linear ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maxHeight: 200,
        }}
      >
        <Description />
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
          const image = draft.images[albumImageIndex];
          if (!image) {
            return;
          }
          image.title = updatedTitle;
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
      placeholder="Title (optional)"
    />
  );
};

const Description = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const utils = api.useContext();

  const updateDescriptionMutation =
    api.albumImage.updateDescription.useMutation({
      async onMutate({ albumImageId, updatedDescription }) {
        const prevData = utils.album.albumPageGetOne.getData();

        await utils.album.albumPageGetOne.cancel();

        utils.album.albumPageGetOne.setData(
          { albumId: album.id },
          (currData) => {
            if (!currData) {
              return prevData;
            }

            const updated = produce(currData, (draft) => {
              const albumImageIndex = draft.images.findIndex(
                (albumImage) => albumImage.id === albumImageId
              );
              const image = draft.images[albumImageIndex];
              if (!image) {
                return;
              }
              image.description = updatedDescription;
            });

            return updated;
          }
        );
      },
      onSuccess: () => {
        toast(<Toast text="Description updated" type="success" />);
      },
      onError: () => {
        toast(
          <Toast
            text="Something went wrong updating the description"
            type="error"
          />
        );
      },
    });

  return (
    <div className="overflow-x-hidden font-serif tracking-wide">
      <TextAreaForm
        onSubmit={({ inputValue }) =>
          updateDescriptionMutation.mutate({
            albumImageId: albumImage.id,
            updatedDescription: inputValue,
          })
        }
        tooltipText="Click to update description"
        initialValue={albumImage.description}
        placeholder="Description (optional)"
        enableBorderOnBlur
        enableHowToSubmitMessage
      />
    </div>
  );
};

const ImagePanel = () => {
  const { image } = useAlbumImageContext();

  const imageDimensionsForScreen = calcImageDimensionsToFitToScreen({
    height: image.naturalHeight,
    width: image.naturalWidth,
  });

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
