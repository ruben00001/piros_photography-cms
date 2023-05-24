import { useState } from "react";

import { useAdmin } from "~/hooks";

export const TextInput = ({
  setValue,
  value,
  id = "text-input-id",
  onBlur,
  onFocus,
  placeholder,
  showBorderOnBlur,
  showPressEnter: showPressEnterIsEnabled,
  isChange = true,
  styles,
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
}) => {
  const [autoFocusReset, setAutoFocusReset] = useState(false);
  const [localIsFocused, setLocalIsFocused] = useState(false);

  const showPressEnterMessage =
    showPressEnterIsEnabled && isChange && localIsFocused && value.length;

  const { isAdmin } = useAdmin();

  return (
    <div
      className={`relative z-10 box-content flex h-full w-[300px] max-w-full items-stretch rounded-sm border  py-1 transition-colors duration-75 ease-in-out focus-within:border-base-300 focus-within:bg-gray-50 ${
        showBorderOnBlur && value.length
          ? "border-base-300"
          : "border-transparent"
      } ${styles?.wrapper || ""}`}
    >
      <input
        className={`z-10 w-full bg-transparent pr-xs text-gray-600 outline-none transition-transform duration-100 ease-in-out focus:translate-x-2 ${
          styles?.input || ""
        } ${showBorderOnBlur && value.length ? "translate-x-2" : ""} ${
          !isAdmin ? "cursor-not-allowed" : ""
        }`}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        autoFocus={false}
        onFocus={(e) => {
          if (!autoFocusReset) {
            e.currentTarget.blur();
            setAutoFocusReset(true);
            return;
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
        disabled={true}
      ></input>
      {showPressEnterMessage ? (
        <div className="absolute -top-1 right-0 z-10 -translate-y-full rounded-sm bg-white bg-opacity-60 py-xxxs px-xs">
          <p className="text-xs text-gray-500">Press enter to submit</p>
        </div>
      ) : null}
    </div>
  );
};
