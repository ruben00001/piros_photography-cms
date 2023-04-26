import { createContext, useContext, type ReactElement } from "react";

import { type Image } from "../_types";

type Value = Image;

const Context = createContext<Value | null>(null);

function Provider({
  children,
  image,
}: {
  children: ReactElement | ((args: Value) => ReactElement);
  image: Image;
}) {
  const value: Value = image;

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useImageContext must be used within its provider!");
  }

  return context;
};

export { Provider as ImageProvider, useThisContext as useImageContext };
