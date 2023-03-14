import { useState } from "react";

const TextInput = ({
  setValue,
  value,
  id = "text-input-id",
  onBlur,
  onFocus,
  placeholder,
  inputAdditionalClasses = "",
  wrapperAdditionalClasses = "",
  showBorderOnBlur,
  showPressEnter: showPressEnterControl,
  isChange = true,
}: {
  value: string;
  setValue: (value: string) => void;
  id?: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  wrapperAdditionalClasses?: string;
  inputAdditionalClasses?: string;
  showBorderOnBlur?: true;
  showPressEnter?: true;
  isChange?: boolean;
}) => {
  const [localIsFocused, setLocalIsFocused] = useState(false);

  const showPressEnterMessage =
    showPressEnterControl && isChange && localIsFocused && value.length;

  return (
    <div
      className={`relative z-10 box-content flex h-[28px] w-[300px] max-w-full items-stretch rounded-sm  border transition-colors duration-75 ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 ${
        showBorderOnBlur && value.length
          ? "border-base-300"
          : "border-transparent"
      } ${wrapperAdditionalClasses}`}
    >
      <input
        className={`absolute left-0 z-10 h-full w-full bg-transparent py-1 text-gray-600 outline-none focus:pl-xs ${inputAdditionalClasses} ${
          showBorderOnBlur && value.length ? "pl-xs" : ""
        }`}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        onFocus={() => {
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
      ></input>
      {showPressEnterMessage ? (
        <div className="absolute -top-1 right-0 z-10 -translate-y-full rounded-sm bg-white bg-opacity-60 py-xxxs px-xs">
          <p className="text-xs text-gray-500">Press enter to submit</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
