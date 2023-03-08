import { CldImage } from "next-cloudinary";
import { useState } from "react";
import ContainerDimension from "../ContainerDimension";
import { SpinnerIcon } from "../Icon";

const MyCldImage = ({ src, fit }: { src: string; fit: "object-contain" }) => {
  const [blurImgIsLoaded, setBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="relative h-full">
      <div
        className={`my-abs-center transition-opacity ${
          !blurImgIsLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <SpinnerIcon />
      </div>
      <ContainerDimension>
        {({ height, width }) => (
          <>
            <CldImage
              width={width}
              height={height}
              effects={[{ blur: "1000" }]}
              quality={1}
              src={src}
              className={`absolute z-10 h-full w-full transition-opacity duration-100 ease-out ${
                !qualityImgIsLoaded ? "opacity-100" : "opacity-0"
              } ${fit}`}
              onLoad={() => setBlurImgIsLoaded(true)}
              alt=""
            />
            <CldImage
              width={width}
              height={height}
              src={src}
              className={`absolute h-full w-full object-contain ${fit}`}
              onLoad={() => setQualityImgIsLoaded(true)}
              alt=""
            />
          </>
        )}
      </ContainerDimension>
    </div>
  );
};

export default MyCldImage;
