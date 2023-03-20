import { useState, useRef } from "react";

import TextInput from "~/components/forms/TextInputDynamicWidth";
import WithTooltip from "~/components/data-display/WithTooltip";

export const TextInputForm = ({
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
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [inputValue, setInputValue] = useState(initialValue || "");

  const prevValueRef = useRef(inputValue);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== inputValue;

  const handleSubmit = () => {
    if (!isChange) {
      return;
    }

    prevValueRef.current = inputValue;

    onSubmit({
      inputValue,
    });
  };

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <WithTooltip text={tooltipText} isDisabled={inputIsFocused} placement="top">
      <form
        className="relative inline-block max-w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        ref={containerRef}
      >
        <div className="form-control ">
          <TextInput
            setValue={(value) => setInputValue(value)}
            value={inputValue}
            placeholder={placeholder}
            showPressEnter
            isChange={isChange}
            onBlur={() => setInputIsFocused(false)}
            onFocus={() => setInputIsFocused(true)}
          />
        </div>
      </form>
    </WithTooltip>
  );
};
