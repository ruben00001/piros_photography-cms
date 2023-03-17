import { useMemo } from "react";
import { useWindowSize } from "react-use";
import { calcImageDimensionsToFitToScreen } from "~/helpers/general";

const useImageDimensionsForScreen = (initialImageDimensions: {
  width: number;
  height: number;
}) => {
  const { height, width } = useWindowSize();

  const imageDimensions = useMemo(
    () => calcImageDimensionsToFitToScreen(initialImageDimensions),
    [height, width]
  );

  return imageDimensions;
};

export default useImageDimensionsForScreen;
