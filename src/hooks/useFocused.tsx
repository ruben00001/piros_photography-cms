import { useState } from "react";

export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);

  return {
    isFocused,
    focusHandlers: {
      onBlur() {
        setIsFocused(false);
      },
      onFocus() {
        setIsFocused(true);
      },
    },
  };
};
