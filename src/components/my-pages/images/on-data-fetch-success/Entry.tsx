/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState } from "react";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";

import { api, type RouterOutputs } from "~/utils/api";
import { UploadIcon } from "~/components/Icon";
import SearchInput from "~/components/SearchInput";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import UploadPanelContent, {
  type OnUploadImage,
} from "~/components/image/select-or-upload-image/UploadPanelContent";
import { ContentBodyLayout } from "~/components/layout/ContentBody";
import { ModalPanelWrapper } from "~/components/modal/PanelWrapper";
import { calcImageDimensions } from "~/helpers/general";
import { fuzzySearch } from "~/helpers/query-data";

const OnDataFetchSuccess = () => {
  return (
    <ContentBodyLayout>
      <div className="p-lg">
        <h1 className="text-xl text-gray-400">Images Page</h1>
        <p className="mt-xxs text-sm text-gray-300">
          Edit images: add and delete; add and remove tags.
        </p>
        <div className="mt-lg">
          <div>
            <UploadNew />
          </div>
          <div className="mt-lg">
            <p className="mt-xxs mb-xs text-sm text-gray-300">
              Uploaded images
            </p>
            <Images />
          </div>
        </div>
      </div>
    </ContentBodyLayout>
  );
};

export default OnDataFetchSuccess;

const UploadNew = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onUploadImage = useUploadImage();

  return (
    <>
      <button
        className={`my-btn-action group mb-sm flex items-center gap-xs rounded-md py-1.5 px-sm text-white`}
        onClick={openModal}
        type="button"
      >
        <span className="text-sm">
          <UploadIcon weight="bold" />
        </span>
        <span className="text-sm font-medium">Upload new</span>
      </button>

      <ModalPanelWrapper isOpen={isOpen} closeModal={closeModal}>
        <UploadPanelContent
          closeModal={closeModal}
          onUploadImage={onUploadImage}
        />
      </ModalPanelWrapper>
    </>
  );
};

const useUploadImage = (): OnUploadImage => {
  const { refetch: refetchImages } = api.image.getAll.useQuery(undefined, {
    enabled: false,
  });

  const createImageMutation = api.image.create.useMutation({
    onSuccess: async () => {
      await refetchImages();

      setTimeout(() => {
        toast(<Toast text="added image" type="success" />);
      }, 650);
    },
    onError: () => {
      toast(<Toast text="Something went wrong adding image" type="error" />);
    },
  });

  return ({
    cloudinary_public_id,
    naturalHeight,
    naturalWidth,
    onSuccess,
    tagIds,
  }) =>
    createImageMutation.mutate(
      {
        cloudinary_public_id,
        naturalHeight,
        naturalWidth,
        tagIds,
      },
      { onSuccess },
    );
};

const Images = () => {
  const [tagQuery, setTagQuery] = useState("");

  const { data: allImages } = api.image.getAll.useQuery();

  return (
    <div>
      {!allImages?.length ? null : (
        <SearchInput
          placeholder="Search by tag"
          inputValue={tagQuery}
          setInputValue={setTagQuery}
        />
      )}
      <div className="mt-md">
        <ImagesGrid query={tagQuery} />
      </div>
    </div>
  );
};

const ImagesGrid = ({ query }: { query: string }) => {
  const { data } = api.image.getAll.useQuery();
  const allImages = data as NonNullable<typeof data>;

  const imagesByQuery = fuzzySearch({
    entities: allImages,
    keys: ["tags.text"],
    pattern: query,
  });

  return !imagesByQuery.length ? (
    <p className="text-gray-600">No matches</p>
  ) : (
    <div className="grid cursor-pointer grid-cols-3 gap-sm pr-2 xl:grid-cols-4">
      {imagesByQuery.map((image) => (
        <Image image={image} key={image.id} />
      ))}
    </div>
  );
};

type Image = RouterOutputs["image"]["getAll"][0];

const Image = ({ image }: { image: Image }) => {
  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  return (
    <div
      className="my-hover-bg relative flex aspect-square flex-col rounded-lg border border-base-200 p-sm"
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
    </div>
  );
};

// delete: show if used or not; can delete if used;
// edit tags
// full screen
// show metadata? when uploaded, updated
// show which album used in?

const ImageMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100"></div>
  );
};
