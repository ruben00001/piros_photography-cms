import { useState } from "react";
import { CldImage } from "next-cloudinary";

import { SpinnerIcon } from "../ui-elements/PhosphorIcons";

export const MyCldImage = ({
  publicId,
  dimensions,
}: {
  publicId: string;
  dimensions: { width: number; height: number };
}) => {
  const [blurImgIsLoaded, setBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="grid flex-grow place-items-center">
      <div className="relative bg-gray-50" style={dimensions}>
        <div
          className={`my-abs-center transition-opacity ${
            !blurImgIsLoaded && !qualityImgIsLoaded
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <SpinnerIcon />
        </div>
        <CldImage
          className={`absolute left-0 top-0 ${
            qualityImgIsLoaded ? "opacity-0" : "opacity-100"
          }`}
          src={publicId}
          {...dimensions}
          style={dimensions}
          effects={[{ blur: "1000" }]}
          quality={1}
          alt=""
          onLoad={() => setBlurImgIsLoaded(true)}
          loading="lazy"
        />
        <CldImage
          className={`${!qualityImgIsLoaded ? "opacity-0" : "opacity-100"}`}
          src={publicId}
          {...dimensions}
          style={dimensions}
          alt=""
          onLoad={() => setQualityImgIsLoaded(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
};
