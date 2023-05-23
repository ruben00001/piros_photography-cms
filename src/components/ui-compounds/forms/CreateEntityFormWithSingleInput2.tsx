import { createContext, useContext, useState, type ReactElement } from "react";

import { checkObjectHasField } from "~/helpers/general";
import { useFocus } from "~/hooks/useFocused";

type ComponentState = {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  resetForm: () => void;
};

const ComponentContext = createContext<ComponentState>({} as ComponentState);

const ComponentProvider = ({
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

const useComponentContext = () => {
  const context = useContext(ComponentContext);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }

  return context;
};

export function CreateEntityFormWithSingleInput2({
  onSubmit,
  children,
}: {
  children: ReactElement | null | (ReactElement | null)[];
  onSubmit: (value: string, resetForm: () => void) => void;
}) {
  return (
    <ComponentProvider>
      {({ inputValue, resetForm }) => (
        <form
          className="relative w-full"
          onSubmit={(e) => {
            e.preventDefault();

            if (!inputValue.length) {
              return;
            }

            onSubmit(inputValue, resetForm);
          }}
        >
          <div className="min-w-[250px] max-w-[400px] rounded-md">
            {children}
          </div>
        </form>
      )}
    </ComponentProvider>
  );
}

const Title = ({ text }: { text: string }) => (
  <p className="mb-xs text-sm text-gray-300">{text}</p>
);

CreateEntityFormWithSingleInput2.Title = Title;

function Input({ children }: { children: ReactElement }) {
  return children;
}

CreateEntityFormWithSingleInput2.Input = Input;

function InputWrapper({
  containerStyles,
  children,
}: {
  containerStyles?: string;
  children: ReactElement | null | (ReactElement | null)[];
}) {
  return (
    <div
      className={`relative rounded-sm border bg-gray-50 py-1 pr-sm ${
        containerStyles || ""
      }`}
    >
      {children}
    </div>
  );
}

Input.Wrapper = InputWrapper;

const InputInner = ({ placeholder }: { placeholder: string }) => {
  const { focusHandlers, isFocused } = useFocus();

  const { inputValue, setInputValue } = useComponentContext();

  return (
    <div
      className={`transition-transform duration-75 ease-in-out ${
        isFocused || !inputValue.length ? "translate-x-xs" : "translate-x-0"
      }`}
    >
      <input
        className="w-full bg-transparent text-base"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        {...focusHandlers}
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

Input.Input = InputInner;

const FormControls = ({
  onCancel,
  submitIsDisabled,
}: {
  onCancel: () => void;
  submitIsDisabled: boolean;
}) => (
  <div className="mt-4 flex items-center justify-between pb-4">
    <button className="my-btn my-btn-neutral" type="button" onClick={onCancel}>
      Cancel
    </button>
    <button
      className={`my-btn my-btn-action ${
        submitIsDisabled ? "cursor-not-allowed" : ""
      }`}
      type="submit"
    >
      Submit
    </button>
  </div>
);

CreateEntityFormWithSingleInput2.Controls = FormControls;
