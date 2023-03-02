import Image from "next/image";
import { type ChangeEvent, useState } from "react";
import { FileImageIcon } from "~/components/Icon";
import Tags from "~/components/image/tags";

const PanelBody = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  return (
    <div className="">
      {imageFile ? <ImageFileDisplay file={imageFile} /> : null}
      <ImageFileInput isFile={Boolean(imageFile)} setFile={setImageFile} />
      {imageFile ? (
        <div className="mt-sm">
          <Tags
            tags={[
              { id: "abeth", text: "hello" },
              { id: "occece", text: "okay" },
            ]}
          />
        </div>
      ) : null}
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
        className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-base-300 py-1 px-sm text-sm text-gray-500"
        htmlFor={uploadInputId}
      >
        <span className="text-neutral">
          <FileImageIcon weight="bold" />
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
