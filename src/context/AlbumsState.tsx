import { createContext, type ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "~/helpers/general";

type AlbumsState = {
  activeAlbumId: string | null;
  setActiveAlbumId: (id: string | null) => void;
};

const Context = createContext<AlbumsState>({} as AlbumsState);

const Provider = ({
  children,
}: {
  children: ReactElement | ((args: AlbumsState) => ReactElement);
}) => {
  const [activeAlbumId, setActiveAlbumId] =
    useState<AlbumsState["activeAlbumId"]>(null);

  const value: AlbumsState = {
    activeAlbumId,
    setActiveAlbumId,
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
