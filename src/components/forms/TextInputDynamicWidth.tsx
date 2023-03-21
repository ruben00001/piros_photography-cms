import { useRef, useState } from "react";
import { useMeasure } from "react-use";

const TextInput = ({
  setValue,
  value,
  id = "text-input-id",
  onBlur,
  onFocus,
  placeholder,
  showBorderOnBlur,
  showPressEnter,
  isChange = true,
  styles,
  minWidth = 50,
  trailingSpace = 20,
  autoFocus = false,
}: {
  value: string;
  setValue: (value: string) => void;
  id?: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  showBorderOnBlur?: true;
  showPressEnter?: true;
  isChange?: boolean;
  styles?: {
    wrapper?: string;
    input?: string;
  };
  minWidth?: number;
  trailingSpace?: number;
  autoFocus?: boolean;
}) => {
  const [localIsFocused, setLocalIsFocused] = useState(false);
  const [isBlurredOnInitialRender, setIsBlurredOnInitialRender] =
    useState(false);

  const [dummyInputRef, { width: dummyInputWidth }] =
    useMeasure<HTMLParagraphElement>();

  const showPressEnterMessage =
    showPressEnter && isChange && localIsFocused && value.length;

  // const inputWidth = dummyInputWidth;
  const inputWidth = dummyInputWidth + trailingSpace;

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={`relative z-10 box-content flex h-full items-stretch rounded-sm border py-1 pr-xs transition-colors duration-75 ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 ${
        showBorderOnBlur && value.length
          ? "border-base-300"
          : "border-transparent"
      } ${styles?.wrapper || ""}`}
    >
      <p className="invisible absolute whitespace-nowrap" ref={dummyInputRef}>
        {value.length ? value : placeholder}
      </p>
      <input
        className={`z-10 bg-transparent pr-xs outline-none transition-transform duration-100 ease-in-out focus:translate-x-2 ${
          styles?.input || ""
        } ${showBorderOnBlur && value.length ? "translate-x-2" : ""} `}
        id={id}
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

          setLocalIsFocused(true);
          if (onFocus) {
            onFocus();
          }
        }}
        onBlur={() => {
          setLocalIsFocused(false);
          if (onBlur) {
            onBlur();
          }
        }}
        style={{
          width: inputWidth,
          // width: localIsFocused ? inputWidthEditing : inputWidth,
          minWidth,
        }}
        ref={inputRef}
      />
      {showPressEnterMessage ? (
        <div className="absolute -top-1 left-0 z-10 -translate-y-full rounded-sm bg-white bg-opacity-70 py-xxxs px-xs font-sans">
          <p className="text-xs text-gray-500">Press enter to submit</p>
        </div>
      ) : null}
      {!autoFocus ? <input type="hidden" autoFocus={true} /> : null}
    </div>
  );
};

export default TextInput;
