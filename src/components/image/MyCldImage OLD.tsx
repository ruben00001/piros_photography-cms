import { CldImage } from "next-cloudinary";
import { useState } from "react";
import ContainerDimension from "../ContainerDimension";
import { SpinnerIcon } from "../Icon";

const MyCldImage = ({
  src,
  fit,
  heightSetByContainer = true,
}: {
  src: string;
  fit: "object-contain" | "object-cover";
  heightSetByContainer: true | { isSetByContainer: false; approxVal: number };
}) => {
  const [blurImgIsLoaded, setBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="relative ">
      {/* <div className="relative flex h-full flex-col"> */}
      <div
        className={`my-abs-center transition-opacity ${
          !blurImgIsLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <SpinnerIcon />
      </div>
      <ContainerDimension ignoreHeight={true}>
        {/* <ContainerDimension ignoreHeight={heightSetByContainer !== true}> */}
        {({ height, width }) => (
          <>
            <Hello />
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
              className={`absolute z-10 h-auto w-full transition-opacity duration-100 ease-out ${
                !qualityImgIsLoaded ? "opacity-100" : "opacity-0"
              } ${fit}`}
              onLoad={() => setBlurImgIsLoaded(true)}
              alt=""
            />
            <CldImage
              width={width}
              height={height}
              src={src}
              className={`absolute h-auto w-full object-contain ${fit}`}
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

const Hello = () => {
  console.log("hello");

  return <div></div>;
};
