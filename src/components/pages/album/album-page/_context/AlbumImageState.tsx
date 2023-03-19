import { createContext, type ReactElement, useContext } from "react";

import useImageDimensionsForScreen from "~/hooks/useImageDimensionsForScreen";

import { type AlbumImage } from "../_types";

type AlbumImageState = AlbumImage & {
  imageDimensionsForScreen: { width: number; height: number };
};

const Context = createContext<AlbumImageState | null>(null);

function Provider({
  children,
  albumImage,
}: {
  children: ReactElement | ((args: AlbumImageState) => ReactElement);
  albumImage: AlbumImage;
}) {
  const imageDimensionsForScreen = useImageDimensionsForScreen({
    height: albumImage.image.naturalHeight,
    width: albumImage.image.naturalWidth,
  });

  const value: AlbumImageState = { ...albumImage, imageDimensionsForScreen };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAlbumImageState must be used within its provider!");
  }

  return context;
};

export {
  Provider as AlbumImageProvider,
  useThisContext as useAlbumImageContext,
};
