import { useRef, useState } from "react";
import DOMPurify from "dompurify";
import ReactTextareaAutosize from "react-textarea-autosize";

import WithTooltip from "../data-display/WithTooltip";

const TextAreaForm = ({
  initialValue = "",
  onSubmit,
  tooltipText,
  placeholder = "Write here",
}: {
  initialValue?: string | null;
  onSubmit: ({ inputValue }: { inputValue: string }) => void;
  tooltipText: string;
  placeholder?: string;
}) => {
  const [value, setValue] = useState(initialValue || "");
  const [isFocused, setIsFocused] = useState(false);

  const prevValueRef = useRef(value);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== value;

  const handleSubmit = () => {
    if (!isChange) {
      return;
    }

    prevValueRef.current = value;

    const clean = DOMPurify.sanitize(value);

    onSubmit({
      inputValue: clean,
    });
  };

  return (
    <WithTooltip
      text={tooltipText}
      isDisabled={isFocused}
      placement="top-start"
    >
      <div
        className="relative inline-block w-full max-w-full"
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget)) {
            return;
          }

          setIsFocused(false);
        }}
      >
        <ReactTextareaAutosize
          className={`relative z-10 box-border h-full w-full min-w-[200px] max-w-full rounded-sm border bg-transparent py-1 transition-all duration-75  ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 focus-within:px-xs ${
            isChange ? "border-yellow-300 px-xs" : "border-transparent"
          }`}
          value={value}
          onSubmit={() => {
            handleSubmit();
          }}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={placeholder}
        />
        {isChange ? (
          <div className="flex justify-between">
            <div className="pl-xs font-sans text-xs text-gray-400">
              Press submit to save
            </div>
            <button
              className={`rounded-md border bg-white py-xxs px-xs font-sans text-sm text-gray-500 hover:bg-base-200 `}
              onClick={handleSubmit}
              type="button"
            >
              Submit
            </button>
          </div>
        ) : null}
      </div>
    </WithTooltip>
  );
};

export default TextAreaForm;
