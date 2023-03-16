import { CldImage } from "next-cloudinary";
import { useState } from "react";
import ContainerDimension from "../ContainerDimension";
import { SpinnerIcon } from "../Icon";

// ! CldImage ts error: width + height throw error but typings don't show as required

const MyCldImage = ({
  src,
  dimensions,
}: {
  src: string;
  dimensions: { width: number; height: number };
}) => {
  return (
    <CldImage
      // className={`w-[${dimensions.width}px] h-[${dimensions.height}px]`}
      src={src}
      {...dimensions}
      style={dimensions}
      alt=""
    />
  );
};

export default MyCldImage;
