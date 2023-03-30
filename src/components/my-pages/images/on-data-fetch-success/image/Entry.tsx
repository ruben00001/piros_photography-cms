import { toast } from "react-toastify";
import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { DeleteIcon, ExpandIcon, TagIcon } from "~/components/Icon";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import { Modal, WarningPanel } from "~/components/modal";
import {
  calcImageDimensions,
  calcImageDimensionsToFitToScreen,
} from "~/helpers/general";
import { useImageContext } from "../../_context";
import Tags from "./tags";

const Image = () => {
  const image = useImageContext();

  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  return (
    <div
      className="group/image relative flex aspect-square flex-col rounded-lg border border-base-200 p-sm transition-colors duration-75 ease-in-out hover:bg-gray-100
"
      ref={containerRef}
    >
      {containerWidth ? (
        <div className="flex flex-grow flex-col">
          <MyCldImage
            publicId={image.cloudinary_public_id}
            dimensions={calcImageDimensions({
              constraint: {
                value: { height: containerWidth, width: containerWidth },
              },
              image: {
                height: image.naturalHeight,
                width: image.naturalWidth,
              },
            })}
          />
        </div>
      ) : null}
      <UnusedBadge />
      <ImageMenu />
    </div>
  );
};

export default Image;

// edit tags
// show metadata? when uploaded, updated
// show which album used in?

const UnusedBadge = () => {
  const image = useImageContext();

  const isUsed = image._count.albumCoverImages || image._count.albumImages;

  if (isUsed) {
    return null;
  }

  return (
    <div className="absolute left-1 top-1 rounded-md border-gray-300 bg-gray-300 px-1 pb-0.5 text-xs text-white">
      unused
    </div>
  );
};

const ImageMenu = () => {
  return (
    <div
      className={`absolute right-1 top-1 z-20 flex items-center gap-sm rounded-md bg-white py-xxs px-xs opacity-0 shadow-lg transition-opacity duration-75 ease-in-out hover:!opacity-100 group-hover/image:opacity-50`}
    >
      <EditTagsModal />
      <OpenImageModal />
      <MenuDeleteModal />
    </div>
  );
};

const OpenImageModal = () => {
  return (
    <Modal
      button={({ open }) => (
        <WithTooltip text="Open image" yOffset={15}>
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/image:text-base-content"
            onClick={open}
          >
            <span className="">
              <ExpandIcon />
            </span>
          </div>
        </WithTooltip>
      )}
      panelContent={() => <OpenedImage />}
    />
  );
};

const OpenedImage = () => {
  const image = useImageContext();

  const imageDimensionsForScreen = calcImageDimensionsToFitToScreen({
    height: image.naturalHeight,
    width: image.naturalWidth,
    maxDecimal: {
      height: 0.9,
      width: 0.9,
    },
  });

  return (
    <MyCldImage
      publicId={image.cloudinary_public_id}
      dimensions={imageDimensionsForScreen}
    />
  );
};

const MenuDeleteModal = () => {
  const image = useImageContext();

  const { refetch: refetchImages } = api.image.imagesPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const deleteMutation = api.image.delete.useMutation({
    onSuccess: async () => {
      await refetchImages();

      toast(<Toast text="deleted image" type="success" />);
    },
    onError: () => {
      toast(<Toast text="delete image failed" type="error" />);
    },
  });

  const isUsed = image._count.albumCoverImages || image._count.albumImages;

  return (
    <Modal
      button={({ open }) => (
        <WithTooltip
          text={isUsed ? "Can't delete because in use" : "Delete image"}
          yOffset={15}
        >
          <div
            className={`rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert ${
              isUsed ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            onClick={() => (!isUsed ? open() : null)}
          >
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </div>
        </WithTooltip>
      )}
      panelContent={({ close: closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              deleteMutation.mutate(
                {
                  imageId: image.id,
                },
                {
                  onSuccess() {
                    closeModal();
                  },
                },
              ),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete album",
          }}
        />
      )}
    />
  );
};

const EditTagsModal = () => {
  return (
    <Modal
      button={({ open }) => (
        <WithTooltip text="Edit tags" yOffset={15}>
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/image:text-base-content"
            onClick={open}
          >
            <span className="">
              <TagIcon />
            </span>
          </div>
        </WithTooltip>
      )}
      panelContent={() => <EditTagsPanelContent />}
    />
  );
};

const EditTagsPanelContent = () => {
  return (
    <div className="relative w-[600px] max-w-[90vw] rounded-2xl bg-white p-6 text-left shadow-xl">
      <Tags />
    </div>
  );
};
