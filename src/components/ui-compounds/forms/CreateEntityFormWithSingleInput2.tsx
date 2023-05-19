import { useState, type FormEvent, type ReactElement } from "react";

export function CreateEntityFormWithSingleInput2({
  onSubmit,
  children,
}: {
  children: ReactElement | null | (ReactElement | null)[];
  onSubmit: (value: string, resetForm: () => void) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const resetForm = () => {
    setInputValue("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.length) {
      return;
    }

    onSubmit(inputValue, resetForm);
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <div className="min-w-[250px] max-w-[400px] rounded-md">{children}</div>
    </form>
  );
}

const Title = ({ text }: { text: string }) => (
  <p className="mb-xs text-sm text-gray-300">{text}</p>
);

CreateEntityFormWithSingleInput2.Title = Title;

function Input({
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

CreateEntityFormWithSingleInput2.Input = Input;

const InputInner = ({
  value,
  placeholder,
  setValue,
}: {
  value: string;
  placeholder: string;
  setValue: (value: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`transition-transform duration-75 ease-in-out ${
        isFocused || !value.length ? "translate-x-xs" : "translate-x-0"
      }`}
    >
      <input
        className="w-full bg-transparent text-base"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

Input.Inner = InputInner;

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
        !submitIsDisabled ? "cursor-not-allowed" : ""
      }`}
      type="submit"
    >
      Submit
    </button>
  </div>
);

CreateEntityFormWithSingleInput2.Controls = FormControls;
