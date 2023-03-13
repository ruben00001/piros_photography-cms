import { createContext, type ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "~/helpers/general";
import { Album } from "~/utils/router-output-types";

type AlbumsState = {
  activeAlbum: Album | null;
  setActiveAlbum: (album: Album | null) => void;
};

const Context = createContext<AlbumsState>({} as AlbumsState);

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

// should use zod for instead of checkObjectHasField?
const useThisContext = () => {
  const context = useContext(Context);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useAlbumsState must be used within its provider!");
  }

  return context;
};

export { Provider as AlbumsProvider, useThisContext as useAlbumsContext };
