import { type ReactElement } from "react";

import { useFocus } from "~/hooks/useFocused";
import { type MyPick } from "~/types/utilities";
import {
  ComponentProvider,
  useComponentContext,
  type ComponentState,
} from "./Context";

export function CreateEntityForm({
  onSubmit,
  children,
}: {
  children:
    | ReactElement
    | ((args: MyPick<ComponentState, "inputValue">) => ReactElement);
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
            {typeof children === "function"
              ? children({ inputValue })
              : children}
          </div>
        </form>
      )}
    </ComponentProvider>
  );
}

const Title = ({ text }: { text: string }) => (
  <p className="mb-xs text-sm text-gray-300">{text}</p>
);

CreateEntityForm.Title = Title;

function Input() {
  throw new Error(
    "CreateEntityForm.Input should not be used as a component - it exists for naming purposes only.",
  );
}

CreateEntityForm.Input = Input;

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

CreateEntityForm.Controls = FormControls;
