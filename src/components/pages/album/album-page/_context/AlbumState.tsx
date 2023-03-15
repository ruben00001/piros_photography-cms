import { createContext, type ReactElement, useContext } from "react";
import { RouterOutputs } from "~/utils/api";

export type Album = NonNullable<RouterOutputs["album"]["albumPageGetOne"]>;

type AlbumState = Album;

const Context = createContext<AlbumState | null>(null);

function Provider({
  children,
  album,
}: {
  children: ReactElement | ((args: AlbumState) => ReactElement);
  album: Album;
}) {
  const value: AlbumState = album;

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAlbumState must be used within its provider!");
  }

  return context;
};

export { Provider as AlbumProvider, useThisContext as useAlbumContext };
