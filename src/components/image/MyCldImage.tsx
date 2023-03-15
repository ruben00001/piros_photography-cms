import { CldImage } from "next-cloudinary";
import { useState } from "react";
import ContainerDimension from "../ContainerDimension";
import { SpinnerIcon } from "../Icon";

const MyCldImage = ({
  src,
  fit,
  heightSetByContainer = true,
  styles,
}: {
  src: string;
  fit: "object-contain" | "object-cover";
  heightSetByContainer: true | { isSetByContainer: false; approxVal: number };
  styles?: {
    wrapper?: string;
    img?: string;
  };
}) => {
  const [blurImgIsLoaded, setBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className={`group relative ${styles?.wrapper}`}>
      {/* <div className="relative flex h-full flex-col"> */}
      <div
        className={`my-abs-center transition-opacity ${
          !blurImgIsLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <SpinnerIcon />
      </div>
      <ContainerDimension ignoreHeight={true}>
        {({ height, width }) => (
          <>
            <CldImage
              width={width}
              height={
                heightSetByContainer === true
                  ? height
                  : heightSetByContainer.approxVal
              }
              effects={[{ blur: "1000" }]}
              quality={1}
              src={src}
              className={`duration-600 absolute z-10 h-auto w-full transition-opacity ease-out ${
                !qualityImgIsLoaded ? "opacity-100" : "-z-10 opacity-0"
              } ${fit}`}
              onLoad={() => setBlurImgIsLoaded(true)}
              alt=""
            />
            <CldImage
              width={width}
              height={height}
              src={src}
              className={`h-auto w-full ${fit} ${styles?.img}`}
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
