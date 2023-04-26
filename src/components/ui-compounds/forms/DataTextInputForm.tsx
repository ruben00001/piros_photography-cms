import { useRef, useState } from "react";
import DOMPurify from "dompurify";
import { useMeasure } from "react-use";

import { WithTooltip, type TooltipProps } from "~/components/ui-display";
import { type MyOmit } from "~/types/utilities";

export const DataTextInputForm = ({
  onSubmit,
  tooltip,
  input: { initialValue = "", minWidth, placeholder = "Write here" },
}: {
  onSubmit: (arg0: { inputValue: string; onSuccess: () => void }) => void;
  tooltip: MyOmit<TooltipProps, "children">;
  input: {
    initialValue?: string | null;
    minWidth?: number;
    placeholder?: string;
  };
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const prevValueRef = useRef(inputValue);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== inputValue;

  const handleSubmit = () => {
    if (!isChange || !inputValue.length) {
      return;
    }

    const clean = DOMPurify.sanitize(inputValue);

    onSubmit({
      inputValue: clean,
      onSuccess() {
        prevValueRef.current = inputValue;
      },
    });
  };

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <WithTooltip
      {...tooltip}
      isDisabled={!tooltip.text || inputIsFocused}
      placement="top"
    >
      <form
        className="relative inline-block max-w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        ref={containerRef}
      >
        <div className="form-control">
          <TextInput
            setValue={setInputValue}
            value={inputValue}
            placeholder={placeholder}
            isChange={isChange}
            minWidth={minWidth}
            setIsFocused={setInputIsFocused}
          />
        </div>
      </form>
    </WithTooltip>
  );
};

const TextInput = ({
  setValue,
  value,
  placeholder,
  isChange,
  minWidth = 50,
  trailingSpace = 20,
  autoFocus = false,
  setIsFocused,
}: {
  value: string;
  setValue: (value: string) => void;
  setIsFocused: (value: boolean) => void;
  placeholder?: string;
  isChange: boolean;
  minWidth?: number;
  trailingSpace?: number;
  autoFocus?: boolean;
}) => {
  const [isBlurredOnInitialRender, setIsBlurredOnInitialRender] =
    useState(false);

  const [dummyInputRef, { width: dummyInputWidth }] =
    useMeasure<HTMLParagraphElement>();

  const inputWidth = dummyInputWidth + trailingSpace;

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div
        className={`relative z-10 box-content flex h-full items-stretch rounded-sm border py-1 pr-xs transition-colors duration-75 ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 ${
          isChange ? "border-yellow-300" : "border-transparent"
        }`}
      >
        <p className="invisible absolute whitespace-nowrap" ref={dummyInputRef}>
          {value.length ? value : placeholder}
        </p>
        <input
          className={`z-10 bg-transparent pr-xs outline-none transition-transform duration-100 ease-in-out focus:translate-x-2  ${
            isChange ? "translate-x-2" : ""
          } `}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          type="text"
          autoComplete="off"
          onFocus={(e) => {
            if (!autoFocus && !isBlurredOnInitialRender) {
              e.currentTarget.blur();
              setIsBlurredOnInitialRender(true);
            }

            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={{
            width: inputWidth > minWidth ? inputWidth : minWidth,
          }}
          ref={inputRef}
        />
      </div>
      {isChange ? (
        <div className="mb-xxs rounded-sm px-xs font-sans">
          <p className="text-xs text-gray-400">Press enter to save</p>
        </div>
      ) : null}
    </>
  );
};
