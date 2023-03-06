import Image from "next/image";
import { type ChangeEvent, useState } from "react";

import { FileImageIcon } from "~/components/Icon";
import Tags from "~/components/image/add-image/tags";

const PanelBody = ({ closeModal }: { closeModal: () => void }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <div className="">
      {imageFile ? <ImageFileDisplay file={imageFile} /> : null}
      <ImageFileInput isFile={Boolean(imageFile)} setFile={setImageFile} />
      {imageFile ? (
        <div className="mt-md">
          <Tags />
        </div>
      ) : null}
      <div className="mt-lg flex items-center justify-between pt-sm">
        <button
          className="my-btn my-btn-neutral"
          type="button"
          onClick={closeModal}
        >
          {!imageFile ? "close" : "cancel"}
        </button>
        {!imageFile ? null : (
          <button className="my-btn my-btn-action" type="button">
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default PanelBody;

const ImageFileDisplay = ({ file }: { file: File }) => {
  const imgSrc = URL.createObjectURL(file);

  return (
    <div className="my-md gap-8">
      <div className="inline-block">
        <Image
          width={150}
          height={150}
          src={imgSrc}
          className="bg-gray-50"
          alt=""
        />
      </div>
      <p className="text-sm text-gray-400">{file.name}</p>
    </div>
  );
};

const uploadInputId = "image-upload-input-id";

const ImageFileInput = ({
  isFile,
  setFile,
}: {
  isFile: boolean;
  setFile: (file: File) => void;
}) => {
  const handleImageInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files) {
      // toast.error("No file selected.");
      return;
    }

    const file = files[0];

    if (!file) {
      // toast.error("No file selected.");
      return;
    }

    const isImage = file.name.match(/.(jpg|jpeg|png|webp|avif|gif|tiff)$/i);

    if (!isImage) {
      // toast.error("Invalid file (needs to be an image).");
      return;
    }

    const isAcceptedImage = file.name.match(/.(jpg|jpeg|png|webp)$/i);

    if (!isAcceptedImage) {
      /*       toast.error(
        "Invalid image type. Needs to be of type .jpg, .jpeg, .png or .webp",
        {
          autoClose: 10000,
        }
      ); */
      return;
    }

    setFile(file);
  };

  return (
    <div>
      <label
        className="my-hover-bg group inline-flex cursor-pointer items-center gap-2 rounded-sm border border-base-300 py-1 px-sm"
        htmlFor={uploadInputId}
      >
        <span className="text-base-300 group-hover:text-base-content">
          <FileImageIcon />
        </span>
        <span className="text-sm text-neutral">
          {!isFile ? "Choose file" : "Change file"}
        </span>
      </label>
      <input
        className="hidden"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={handleImageInputFileChange}
        id={uploadInputId}
        name="files"
        type="file"
        autoComplete="off"
      />
      <p className="mt-xs text-sm text-gray-400">
        Accepted image types: png, jpg, jpeg, webp
      </p>
    </div>
  );
};
