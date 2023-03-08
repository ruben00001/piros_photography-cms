import { CldImage } from "next-cloudinary";
import { useState } from "react";
import ContainerDimension from "../ContainerDimension";

const MyCldImage = ({ src, fit }: { src: string; fit: "object-contain" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-full">
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
                !isLoaded ? "opacity-100" : "opacity-0"
              } ${fit}`}
              onLoad={() => setIsLoaded(true)}
              alt=""
            />
            <CldImage
              width={width}
              height={height}
              src={src}
              className={`absolute h-full w-full object-contain ${fit}`}
              onLoad={() => setIsLoaded(true)}
              alt=""
            />
          </>
        )}
      </ContainerDimension>
    </div>
  );
};

export default MyCldImage;
