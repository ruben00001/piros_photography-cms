import { createContext, type ReactElement, useContext, useState } from "react";
import { RouterOutputs } from "~/utils/api";

type AlbumType = RouterOutputs["album"]["albumsPageGetAll"][0];

type AlbumsState = {
  activeAlbum: AlbumType | null;
  setActiveAlbum: (album: AlbumType | null) => void;
};

const Context = createContext<AlbumsState | null>(null);

const Provider = ({
  children,
}: {
  children: ReactElement | ((args: AlbumsState) => ReactElement);
}) => {
  const [activeAlbum, setActiveAlbum] =
    useState<AlbumsState["activeAlbum"]>(null);

  const value: AlbumsState = {
    activeAlbum,
    setActiveAlbum,
  };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAlbumsState must be used within its provider!");
  }

  return context;
};

export { Provider as AlbumsProvider, useThisContext as useAlbumsContext };
