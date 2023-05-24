/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState } from "react";

import { api } from "~/utils/api";
import Layout from "~/components/layouts";
import {
  UploadPanelContent,
  type OnUploadImage,
} from "~/components/site-parts/select-or-upload-image";
import { SearchInput } from "~/components/ui-compounds";
import { MyModal } from "~/components/ui-display";
import { UploadIcon } from "~/components/ui-elements";
import { fuzzySearch } from "~/helpers/query-data";
import { useToast } from "~/hooks";
import { ImageProvider } from "../_context";
import Image from "./image/Entry";

const OnDataFetchSuccess = () => (
  <Layout.ContentBody maxWidth={1800}>
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
          <p className="mt-xxs mb-xs text-sm text-gray-300">Uploaded images</p>
          <Images />
        </div>
      </div>
    </div>
  </Layout.ContentBody>
);

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

      <MyModal.Default isOpen={isOpen} closeModal={closeModal}>
        <UploadPanelContent
          closeModal={closeModal}
          onUploadImage={onUploadImage}
        />
      </MyModal.Default>
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

  const toast = useToast();

  const createImageMutation = api.image.create.useMutation({
    async onSuccess() {
      await refetchImages();

      setTimeout(() => {
        toast.success("added image");
      }, 650);
    },
    onError() {
      toast.error("Something went wrong adding image");
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
