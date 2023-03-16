import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CaretDownIcon, LikeIcon } from "~/components/Icon";

import MyCldImage from "~/components/image/MyCldImage2";
import { useAlbumImageContext } from "../../../_context/AlbumImageState";

const ImageModalPanel = () => {
  const { image } = useAlbumImageContext();

  // ! need to use the calcImagDimensions func below. Could put in context
  const imageIsLandscape = image.width > image.height;

  return (
    <div
      className={`flex gap-sm ${
        imageIsLandscape ? "flex-col" : "flex-row-reverse"
      }`}
    >
      <ImagePanel />
      <DescriptionPanel />
    </div>
  );
};

export default ImageModalPanel;

const DescriptionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ! can pass image width to title component below to have clap in line with image

  return (
    <div className="text-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex gap-xl">
          <div>A title</div>
          <button
            className="flex items-center gap-xs text-xs text-gray-500"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <span>read {isExpanded ? "less" : "more"}</span>
          </button>
        </div>
        <div className="flex items-center gap-xs text-base-content">
          <div className="text-lg">
            <LikeIcon />
          </div>
          <div className="">11</div>
        </div>
      </div>
      <div
        className={`max-h-[200px] overflow-y-auto transition-opacity duration-150 ease-linear ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-serif tracking-wide">
          Quisque vitae dolor tincidunt, ornare diam tincidunt, feugiat tellus.
          Proin placerat tellus non vehicula vulputate. Aliquam faucibus felis
          ut eros consectetur semper. Donec volutpat tellus dapibus quam mollis
          varius. Donec bibendum erat in rutrum rhoncus. Aenean ut ante massa.
          Fusce ultricies ultrices mi, ac volutpat quam bibendum quis.
        </p>
        <p className="mt-sm font-mono text-sm text-base-content">
          [ Comments will go here ]
        </p>
      </div>
    </div>
  );
};

const ImagePanel = () => {
  const { image } = useAlbumImageContext();

  return (
    // <div className="flex-grow border-2 bg-white/90">
    <MyCldImage
      src={image.cloudinary_public_id}
      dimensions={calcImageDimensions({
        imageHeight: image.height!,
        imageWidth: image.width!,
      })}
    />
  );
};

const calcImageDimensions = ({
  imageHeight,
  imageWidth,
}: {
  imageWidth: number;
  imageHeight: number;
}): { width: number; height: number } => {
  const imageAspectRatio = imageWidth / imageHeight;

  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  let width = maxWidth;
  let height = width / imageAspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * imageAspectRatio;
  }

  return { width, height };
};
