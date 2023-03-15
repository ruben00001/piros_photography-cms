import { createContext, type ReactElement, useContext, useState } from "react";

type ImageContext =
  | null
  | "cover"
  | "body-add"
  | { replace: { where: { id: string } } };

type State = {
  imageContext: ImageContext;
  setImageContext: (imageContext: ImageContext) => void;
};

const Context = createContext<State | null>(null);

function Provider({
  children,
}: {
  children: ReactElement | ((args: State) => ReactElement);
}) {
  const [imageContext, setImageContext] = useState<ImageContext>(null);

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
