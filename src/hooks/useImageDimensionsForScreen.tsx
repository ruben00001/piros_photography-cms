import { useMemo } from "react";
import { useWindowSize } from "react-use";
import { calcImageDimensionsToFitToScreen } from "~/helpers/general";

const useImageDimensionsForScreen = (initialImageDimensions: {
  width: number;
  height: number;
}) => {
  const window = useWindowSize();

  const imageDimensions = useMemo(
    () => calcImageDimensionsToFitToScreen(initialImageDimensions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [window.height, window.width]
  );

  return imageDimensions;
};

export default useImageDimensionsForScreen;
