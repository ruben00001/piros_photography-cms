import { Dialog } from "@headlessui/react";
import { CldImage } from "next-cloudinary";
import { forwardRef } from "react";
import { api } from "~/utils/api";

// eslint-disable-next-line react/display-name
export const Panel = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Dialog.Panel
      className="relative w-[90vw] max-w-[1200px] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      ref={ref}
    >
      <Dialog.Title
        as="h3"
        className="border-b border-b-base-300 pb-sm leading-6 text-base-content"
      >
        Uploaded Images
      </Dialog.Title>
      <div className="mt-md">
        <UploadedImages />
      </div>
    </Dialog.Panel>
  );
});

export default Panel;

const UploadedImages = () => {
  const { data: allImages, isError, isLoading } = api.image.getAll.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>There was an error fetching images.</p>
      ) : !allImages ? null : (
        <div className="grid grid-cols-3">
          {allImages.map((dbImage) => (
            <div className="border-4" key={dbImage.id}>
              <CldImage
                width={400}
                height={400}
                alt=""
                src={dbImage.cloudinary_public_id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
