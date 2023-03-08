import { createContext, type ReactElement, useContext } from "react";

import { checkObjectHasField } from "~/helpers/general";
import { type Album } from "~/utils/router-output-types";

type AlbumState = Album;

const Context = createContext<AlbumState>({} as AlbumState);

const Provider = ({
  children,
  album,
}: {
  children: ReactElement | ((args: AlbumState) => ReactElement);
  album: Album;
}) => {
  const value: AlbumState = album;

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

// should use zod for instead of checkObjectHasField?
const useThisContext = () => {
  const context = useContext(Context);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useAlbumState must be used within its provider!");
  }

  return context;
};

export { Provider as AlbumProvider, useThisContext as useAlbumContext };
