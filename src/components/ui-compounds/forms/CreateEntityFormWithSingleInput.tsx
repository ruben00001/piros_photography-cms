import { useState, type FormEvent, type ReactElement } from "react";

export const MyForm = ({
  computeIsInputError,
  elements,
  mutationStatusOverlay,
  onCancelButtonClick,
  onSubmit,
  submitIsDisabled,
  text: { placeholder, title },
}: {
  computeIsInputError?: (inputValue: string) => boolean;
  elements?: {
    input?: ReactElement;
    inputMessage?: ReactElement;
  };
  mutationStatusOverlay: ReactElement;
  onCancelButtonClick: () => void;
  onSubmit: (value: string, resetForm: () => void) => void;
  text: {
    title: string;
    placeholder: string;
  };
  submitIsDisabled: (inputValue: string) => boolean;
}) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const resetForm = () => {
    setValue("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value.length) {
      return;
    }

    onSubmit(value, resetForm);
  };

  const isInputError = computeIsInputError && computeIsInputError(value);

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <div className="min-w-[250px] max-w-[400px] rounded-md">
        <p className="mb-xs text-sm text-gray-300">{title}</p>
        <div
          className={`relative rounded-sm border bg-gray-50 py-1 pr-sm ${
            isInputError ? "border-my-alert-content" : ""
          }`}
        >
          {elements?.input}
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
        </div>
        {elements?.inputMessage ? isInputError && elements.inputMessage : null}
        <div className="mt-4 flex items-center justify-between pb-4">
          <button
            className="my-btn my-btn-neutral"
            type="button"
            onClick={onCancelButtonClick}
          >
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
      </div>
      {mutationStatusOverlay}
    </form>
  );
};
