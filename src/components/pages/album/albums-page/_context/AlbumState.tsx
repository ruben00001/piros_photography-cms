import { createContext, type ReactElement, useContext } from "react";

import { type Album } from "../_types";

// todo: Album type differs with each type of fetch; differs with what's 'included' in the fetch.

type Value = Album;

const Context = createContext<Value | null>(null);

function Provider({
  children,
  album,
}: {
  children: ReactElement | ((args: Value) => ReactElement);
  album: Album;
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
