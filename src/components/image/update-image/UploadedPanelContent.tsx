import { useState, type ReactElement } from "react";

import { fuzzySearch } from "~/helpers/query-data";
import { api } from "~/utils/api";

import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import SearchInput from "~/components/SearchInput";

export type OnSelectImage = (arg0: { imageId: string }) => void;

const UploadedPanelContent = ({
  onSelectImage,
  closeModal,
}: {
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
  return (
    <div className="relative flex h-[700px] max-h-[70vh] w-[90vw] max-w-[1200px] flex-col rounded-2xl bg-white p-6 text-left shadow-xl">
      <h3 className="border-b border-b-base-300 pb-sm leading-6 text-base-content">
        Uploaded Images
      </h3>
      <div className="mt-md flex-grow overflow-y-auto">
        <ImagesStatusWrapper>
          <Images onSelectImage={onSelectImage} closeModal={closeModal} />
        </ImagesStatusWrapper>
      </div>
      <div className="mt-xl">
        <button
          className="my-btn my-btn-neutral"
          type="button"
          onClick={() => closeModal()}
        >
          close
        </button>
      </div>
    </div>
  );
};

export default UploadedPanelContent;

const ImagesStatusWrapper = ({ children }: { children: ReactElement }) => {
  const { isError, isLoading } = api.image.getAll.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>There was an error fetching images.</p>
      ) : (
        children
      )}
    </div>
  );
};

const Images = ({
  onSelectImage,
  closeModal,
}: {
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
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
        <ImagesGrid
          query={tagQuery}
          onSelectImage={onSelectImage}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

const ImagesGrid = ({
  query,
  onSelectImage,
  closeModal,
}: {
  query: string;
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
  const { data: allImages } = api.image.getAll.useQuery();

  if (!allImages) {
    return <p>Something went wrong...</p>;
  }

  const imagesByQuery = fuzzySearch({
    entities: allImages,
    keys: ["tags.text"],
    pattern: query,
  });

  return !imagesByQuery.length ? (
    <p className="text-gray-600">No matches</p>
  ) : (
    <div className="grid cursor-pointer grid-cols-4 gap-sm">
      {imagesByQuery.map((dbImage) => (
        <WithTooltip text="click to add" type="action" key={dbImage.id}>
          <div
            className="my-hover-bg rounded-lg border border-base-200 p-sm"
            onClick={() => {
              onSelectImage({ imageId: dbImage.id });
              closeModal();
            }}
          >
            <div className="aspect-square">
              <MyCldImage
                src={dbImage.cloudinary_public_id}
                fit="object-contain"
                heightSetByContainer
              />
            </div>
          </div>
        </WithTooltip>
      ))}
    </div>
  );
};
