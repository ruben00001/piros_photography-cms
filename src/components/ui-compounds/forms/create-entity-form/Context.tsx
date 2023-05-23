import { createContext, useContext, useState, type ReactElement } from "react";

import { checkObjectHasField } from "~/helpers/general";

export type ComponentState = {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  resetForm: () => void;
};

const ComponentContext = createContext<ComponentState>({} as ComponentState);

export const ComponentProvider = ({
  children,
}: {
  children: ReactElement | ((args: ComponentState) => ReactElement);
}) => {
  const [inputValue, setInputValue] = useState("");

  const resetForm = () => {
    setInputValue("");
  };

  const value: ComponentState = {
    inputValue,
    setInputValue,
    resetForm,
  };

  return (
    <ComponentContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </ComponentContext.Provider>
  );
};

export const useComponentContext = () => {
  const context = useContext(ComponentContext);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }

  return context;
};
