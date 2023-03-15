import { createContext, type ReactElement, useContext, useState } from "react";

type State = {
  imageContext: null | "cover" | "body";
  setImageContext: (imageContext: null | "cover" | "body") => void;
};

const Context = createContext<State | null>(null);

function Provider({
  children,
}: {
  children: ReactElement | ((args: State) => ReactElement);
}) {
  const [imageContext, setImageContext] = useState<State["imageContext"]>(null);

  const value = { imageContext, setImageContext };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useImageTypeContext must be used within its provider!");
  }

  return context;
};

export { Provider as ImageTypeProvider, useThisContext as useImageTypeContext };
