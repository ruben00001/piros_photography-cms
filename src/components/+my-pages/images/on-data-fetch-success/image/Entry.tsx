import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { MyCldImage } from "~/components/containers";
import { MyModal, WithTooltip } from "~/components/ui-display";
import { DeleteIcon, ExpandIcon, TagIcon } from "~/components/ui-elements";
import { WarningPanel } from "~/components/ui-written";
import {
  calcImageDimensions,
  calcImageDimensionsToFitToScreen,
} from "~/helpers/general";
import { useAdmin, useToast } from "~/hooks";
import { useImageContext } from "../../_context";
import { ImageMenu } from "./_containers";
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
      <ImageMenu>
        <EditTagsModal />
        <OpenImageModal />
        <MenuDeleteModal />
      </ImageMenu>
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

const OpenImageModal = () => (
  <MyModal.DefaultButtonAndPanel
    button={({ openModal }) => (
      <ImageMenu.Button
        icon={<ExpandIcon />}
        onClick={openModal}
        tooltipText="Open image"
      />
    )}
    panelContent={() => <OpenedImage />}
  />
);

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

  const toast = useToast();

  const deleteMutation = api.image.delete.useMutation({
    async onSuccess() {
      await refetchImages();

      toast.success("deleted image");
    },
    onError() {
      toast.error("delete image failed");
    },
  });

  const isUsed = image._count.albumCoverImages || image._count.albumImages;

  const { ifAdmin, isAdmin } = useAdmin();

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <WithTooltip
          text={isUsed ? "Can't delete because in use" : "Delete image"}
          yOffset={15}
        >
          <div
            className={`rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert ${
              isUsed || !isAdmin
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
            onClick={() => (!isUsed ? openModal() : null)}
          >
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </div>
        </WithTooltip>
      )}
      panelContent={({ closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              ifAdmin(() =>
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
              ),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete image",
          }}
        />
      )}
    />
  );
};

const EditTagsModal = () => {
  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <WithTooltip text="Edit tags" yOffset={15}>
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/image:text-base-content"
            onClick={openModal}
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
