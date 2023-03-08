import { Dialog } from "@headlessui/react";
import { forwardRef } from "react";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";

import MyCldImage from "~/components/image/MyCldImage";
import { fuzzySearch } from "~/helpers/query";
import { api } from "~/utils/api";
import { type Image } from "~/utils/router-output-types";

type UpdateCoverImage = (imageId: string) => void;

// eslint-disable-next-line react/display-name
export const Panel = forwardRef<
  HTMLDivElement,
  { updateCoverImage: UpdateCoverImage }
>(({ updateCoverImage }, ref) => {
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
        <UploadedImagesWrapper updateCoverImage={updateCoverImage} />
      </div>
    </Dialog.Panel>
  );
});

export default Panel;

const UploadedImagesWrapper = ({
  updateCoverImage,
}: {
  updateCoverImage: UpdateCoverImage;
}) => {
  const { data: allImages, isError, isLoading } = api.image.getAll.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>There was an error fetching images.</p>
      ) : !allImages ? null : (
        <UploadedImages
          images={allImages}
          updateCoverImage={updateCoverImage}
        />
      )}
    </div>
  );
};

const UploadedImages = ({
  updateCoverImage,
  images: allImages,
}: {
  updateCoverImage: UpdateCoverImage;
  images: Image[];
}) => {
  const filteredByQuery = fuzzySearch({
    entities: allImages,
    keys: ["tags.text"],
    pattern: "oud",
  });

  return (
    <div className="grid cursor-pointer grid-cols-4 gap-sm">
      {allImages.map((dbImage) => (
        <WithTooltip text="click to add" type="action" key={dbImage.id}>
          <div
            className="my-hover-bg rounded-lg border border-base-200 p-sm"
            onClick={() => updateCoverImage(dbImage.id)}
          >
            <div className="aspect-square">
              <MyCldImage
                src={dbImage.cloudinary_public_id}
                fit="object-contain"
              />
            </div>
          </div>
        </WithTooltip>
      ))}
    </div>
  );
};
