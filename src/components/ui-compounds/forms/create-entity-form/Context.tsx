import { createContext, useContext, useState, type ReactElement } from "react";

export type ComponentState = {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  resetForm: () => void;
};

const ComponentContext = createContext<ComponentState | null>(null);

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

  if (!context) {
    throw new Error("useComponentContext must be used within its provider!");
  }

  return context;
};
