import { type ReactElement } from "react";
import { AlbumProvider, Album } from "./_context/AlbumState";
import { ImageTypeProvider } from "./_context/ImageType";

const ProvidersInit = ({
  children,
  album,
}: {
  children: ReactElement;
  album: Album;
}) => {
  return (
    <AlbumProvider album={album}>
      <ImageTypeProvider>{children}</ImageTypeProvider>
    </AlbumProvider>
  );
};

export default ProvidersInit;
