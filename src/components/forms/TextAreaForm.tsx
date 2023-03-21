import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import ReactTextareaAutosize from "react-textarea-autosize";

import WithTooltip from "../data-display/WithTooltip";
import { useMeasure } from "react-use";

const TextAreaForm = ({
  initialValue = "",
  onSubmit,
  tooltipText,
  placeholder = "Write here",
  onBlur,
  onFocus,
  enableHowToSubmitMessage,
  enableBorderOnBlur,
}: {
  initialValue?: string | null;
  onSubmit: ({ inputValue }: { inputValue: string }) => void;
  tooltipText: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  enableBorderOnBlur?: true;
  enableHowToSubmitMessage?: true;
}) => {
  const [value, setValue] = useState(initialValue || "");
  const [localIsFocused, setLocalIsFocused] = useState(false);

  const prevValueRef = useRef(value);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== value;

  const showHowToSubmitMessage =
    enableHowToSubmitMessage && isChange && localIsFocused && value.length;

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

  const [dummyRef, { width: dummyWidth }] = useMeasure<HTMLDivElement>();

  const [initialContainerWidth, setInitialContainerWidth] = useState<
    number | null
  >(null);

  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  useEffect(() => {
    if (!containerWidth || initialContainerWidth) {
      return;
    }
    setInitialContainerWidth(containerWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-hidden font-serif tracking-wide"
    >
      {!initialContainerWidth ? null : (
        <WithTooltip
          text={tooltipText}
          isDisabled={localIsFocused}
          placement="top-start"
        >
          <>
            <p className="invisible absolute -z-10" ref={dummyRef}>
              {value.length ? value : placeholder}
            </p>
            <div
              className="relative inline-block max-w-full"
              onFocus={() => {
                setLocalIsFocused(true);
                if (onFocus) {
                  onFocus();
                }
              }}
              onBlur={(e) => {
                if (e.currentTarget.contains(e.relatedTarget)) {
                  return;
                }

                setLocalIsFocused(false);
                if (onBlur) {
                  onBlur();
                }
              }}
            >
              <ReactTextareaAutosize
                className={`relative z-10 box-content h-full min-w-[200px] max-w-full rounded-sm bg-transparent py-1 transition-colors duration-75 ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 ${
                  enableBorderOnBlur && isChange
                    ? "border-base-300"
                    : "border-transparent"
                } ${
                  (enableBorderOnBlur && isChange) || localIsFocused
                    ? "px-xs"
                    : ""
                }`}
                value={value}
                onSubmit={() => {
                  handleSubmit();
                }}
                onChange={(event) => {
                  setValue(event.target.value);
                }}
                placeholder={placeholder}
                style={{
                  width: dummyWidth + 20,
                  maxWidth: initialContainerWidth,
                }}
              />
              {localIsFocused && isChange ? (
                <div className="flex justify-between">
                  <div></div>
                  <button
                    className={`rounded-md border bg-white py-xxs px-xs font-sans text-sm text-gray-500 hover:bg-base-200 `}
                    onClick={handleSubmit}
                    type="button"
                  >
                    Submit
                  </button>
                </div>
              ) : null}
              {showHowToSubmitMessage ? (
                <>
                  <div className="absolute -top-1 right-0 z-10 -translate-y-full rounded-sm bg-white bg-opacity-60 py-xxxs px-xs font-sans">
                    <p className="text-xs text-gray-500">
                      Click on submit button to submit
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </>
        </WithTooltip>
      )}
    </div>
  );
};

export default TextAreaForm;
