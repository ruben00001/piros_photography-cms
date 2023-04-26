import { useState, type ChangeEvent } from "react";
import NextImage from "next/image";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { MyToast } from "~/components/ui-display";
import { MySpinner } from "~/components/ui-elements";
import {
  ErrorIcon,
  FileImageIcon,
  TickIcon,
} from "~/components/ui-elements/Icon";
import {
  StringArrStateProvider as TagsIdProvider,
  useStringArrStateContext as useTagsIdContext,
} from "~/context/StringArrState";
import { handleUploadImage } from "~/helpers/cloudinary";
import Tags from "./tags";

export type OnUploadImage = (arg0: {
  cloudinary_public_id: string;
  naturalHeight: number;
  naturalWidth: number;
  tagIds?: string[];
  onSuccess: () => void;
}) => void;

export const UploadPanelContent = (props: {
  onUploadImage: OnUploadImage | null;
  closeModal: () => void;
}) => (
  <div className="relative w-[600px] max-w-[90vw] rounded-2xl bg-white p-6 text-left shadow-xl">
    <h3 className="border-b border-b-base-300 pb-sm leading-6 text-base-content">
      Upload Image
    </h3>
    <div className="mt-md">
      <TagsIdProvider>
        <UploadFunctionality {...props} />
      </TagsIdProvider>
    </div>
  </div>
);

const UploadFunctionality = ({
  onUploadImage,
  closeModal,
}: {
  onUploadImage: OnUploadImage | null;
  closeModal: () => void;
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    naturalHeight: number;
    naturalWidth: number;
  } | null>(null);

  const [createImageStatus, setCreateImageStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");

  const { strings: tagIds } = useTagsIdContext();

  const { refetch: fetchSignature } = api.image.createSignature.useQuery(
    {
      upload_preset: "signed",
    },
    { enabled: false },
  );

  const handleCreateImage = async () => {
    if (!imageFile || !imageDimensions) {
      return;
    }

    try {
      if (!onUploadImage) {
        throw new Error("onUploadImage not provided");
      }
      setCreateImageStatus("pending");

      const { data: signatureData } = await fetchSignature();

      if (!signatureData) {
        throw new Error("no signatureData");
      }

      const uploadRes = await handleUploadImage({
        file: imageFile,
        signatureData,
      });

      onUploadImage({
        cloudinary_public_id: uploadRes.cloudinary_public_id,
        naturalHeight: imageDimensions.naturalHeight,
        naturalWidth: imageDimensions.naturalWidth,
        tagIds,
        onSuccess: () => {
          setCreateImageStatus("success");

          setTimeout(() => {
            closeModal();

            toast(<MyToast text="uploaded image" type="success" />);
          }, 500);
        },
      });
    } catch (error) {
      setCreateImageStatus("error");
    }
  };

  return (
    <div>
      <div className="max-h-[60vh] overflow-y-auto pr-xs">
        {imageFile ? (
          <ImageFileDisplay file={imageFile} onLoad={setImageDimensions} />
        ) : null}
        <ImageFileInput isFile={Boolean(imageFile)} setFile={setImageFile} />
        {imageFile ? (
          <div className="mt-md">
            <Tags />
          </div>
        ) : null}
      </div>
      <div className="mt-lg flex items-center justify-between pt-sm">
        <button
          className="my-btn my-btn-neutral"
          type="button"
          onClick={() => closeModal()}
        >
          {!imageFile ? "close" : "cancel"}
        </button>
        {!imageFile ? null : (
          <button
            className="my-btn my-btn-action"
            onClick={() => void handleCreateImage()}
            type="button"
          >
            Upload
          </button>
        )}
      </div>
      {createImageStatus === "pending" ||
      createImageStatus === "success" ||
      createImageStatus === "error" ? (
        <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center rounded-2xl bg-white bg-opacity-70">
          <div className="flex items-center gap-sm">
            {createImageStatus === "pending" ? (
              <>
                <MySpinner />
                <p className="font-mono">Uploading image...</p>
              </>
            ) : createImageStatus === "success" ? (
              <>
                <span className="text-success">
                  <TickIcon />
                </span>
                <p className="font-mono">Upload success</p>
              </>
            ) : (
              <>
                <span className="text-my-error-content">
                  <ErrorIcon />
                </span>
                <p className="font-mono">Upload error</p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ImageFileDisplay = ({
  file,
  onLoad,
}: {
  file: File;
  onLoad: (arg0: { naturalHeight: number; naturalWidth: number }) => void;
}) => {
  // was a bug where onLoad was causing constant re-render of this component
  const [isLoaded, setIsLoaded] = useState(false);
  const imgSrc = URL.createObjectURL(file);

  return (
    <div className="my-md gap-8">
      <div className="inline-block">
        <NextImage
          width={300}
          height={300}
          src={imgSrc}
          className="bg-gray-50"
          alt=""
          onLoad={(e) => {
            if (isLoaded) {
              return;
            }
            setIsLoaded(true);
            onLoad({
              naturalHeight: e.currentTarget.naturalHeight,
              naturalWidth: e.currentTarget.naturalWidth,
            });
          }}
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
      return;
    }

    const file = files[0];

    if (!file) {
      return;
    }

    const isImage = file.name.match(/.(jpg|jpeg|png|webp|avif|gif|tiff)$/i);

    if (!isImage) {
      return;
    }

    const isAcceptedImage = file.name.match(/.(jpg|jpeg|png|webp)$/i);

    if (!isAcceptedImage) {
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
