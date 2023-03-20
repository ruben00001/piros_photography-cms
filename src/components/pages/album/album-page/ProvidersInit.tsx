import { type ReactElement } from "react";

import { AlbumProvider } from "./_context/AlbumState";
import { type Album } from "./_types";

const ProvidersInit = ({
  children,
  album,
}: {
  children: ReactElement;
  album: Album;
}) => {
  return <AlbumProvider album={album}>{children}</AlbumProvider>;
};

export default ProvidersInit;
