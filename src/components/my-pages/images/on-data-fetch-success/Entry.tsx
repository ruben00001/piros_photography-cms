/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { UploadIcon } from "~/components/Icon";
import SearchInput from "~/components/SearchInput";
import Toast from "~/components/data-display/Toast";
import UploadPanelContent, {
  type OnUploadImage,
} from "~/components/image/select-or-upload-image/UploadPanelContent";
import { ContentBodyLayout } from "~/components/layout/ContentBody";
import { ModalPanelWrapper } from "~/components/modal/PanelWrapper";
import { fuzzySearch } from "~/helpers/query-data";
import { ImageProvider } from "../_context";
import Image from "./image/Entry";

const OnDataFetchSuccess = () => {
  return (
    <ContentBodyLayout maxWidth={1800}>
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
  const { refetch: refetchImages } = api.image.imagesPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

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

  const { data: allImages } = api.image.imagesPageGetAll.useQuery(undefined, {
    enabled: false,
  });

  return (
    <div>
      {!allImages?.length ? null : (
        <SearchInput
          placeholder="Search by tag or album title"
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
  const { data } = api.image.imagesPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const allImages = data as NonNullable<typeof data>;

  const imagesByQuery = fuzzySearch({
    entities: allImages,
    keys: ["tags.text", "albumImages.album.title", "albumCoverImages.title"],
    pattern: query,
  });

  return !imagesByQuery.length ? (
    <p className="text-gray-600">No matches</p>
  ) : (
    <div className="grid cursor-pointer grid-cols-3 gap-sm pr-2 xl:grid-cols-4">
      {imagesByQuery.map((image) => (
        <ImageProvider image={image} key={image.id}>
          <Image />
        </ImageProvider>
      ))}
    </div>
  );
};
