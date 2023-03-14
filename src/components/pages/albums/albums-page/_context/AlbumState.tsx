import { createContext, type ReactElement, useContext } from "react";

import { RouterOutputs } from "~/utils/api";

// todo: Album type differs with each type of fetch; differs with what's 'included' in the fetch.
type AlbumType = RouterOutputs["album"]["albumsPageGetAll"][0];

type Value = AlbumType;

const Context = createContext<Value | null>(null);

function Provider({
  children,
  album,
}: {
  children: ReactElement | ((args: Value) => ReactElement);
  album: AlbumType;
}) {
  const value: Value = album;

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
