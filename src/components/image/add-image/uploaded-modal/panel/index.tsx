import { Dialog } from "@headlessui/react";
import { forwardRef, useState, type ReactElement } from "react";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";

import MyCldImage from "~/components/image/MyCldImage";
import SearchInput from "~/components/SearchInput";
import { useUploadedModalVisibilityStore } from "~/context/UploadedModalVisibilityState";
import { fuzzySearch } from "~/helpers/query";
import { api } from "~/utils/api";
// import { type Image } from "~/utils/router-output-types";

type OnSelectImage = (imageId: string) => void;

// eslint-disable-next-line react/display-name
export const Panel = forwardRef<
  HTMLDivElement,
  { onSelectImage: OnSelectImage }
>(({ onSelectImage: updateCoverImage }, ref) => {
  const { closeModal } = useUploadedModalVisibilityStore();

  return (
    <Dialog.Panel
      className="relative w-[90vw] max-w-[1200px] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      ref={ref}
    >
      <Dialog.Title
        as="h3"
        className="border-b border-b-base-300 pb-sm leading-6 text-base-content"
        onClick={() => toast(<Toast text="Hello" type="success" />)}
      >
        Uploaded Images
      </Dialog.Title>
      <div className="mt-md">
        <ImagesStatusWrapper>
          <Images onSelectImage={updateCoverImage} />
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
    </Dialog.Panel>
  );
});

export default Panel;

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

const Images = ({ onSelectImage }: { onSelectImage: OnSelectImage }) => {
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
        <ImagesGrid query={tagQuery} onSelectImage={onSelectImage} />
      </div>
    </div>
  );
};

const ImagesGrid = ({
  query,
  onSelectImage,
}: {
  query: string;
  onSelectImage: OnSelectImage;
}) => {
  const { data: allImages } = api.image.getAll.useQuery();

  const { closeModal } = useUploadedModalVisibilityStore();

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
              onSelectImage(dbImage.id);
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
