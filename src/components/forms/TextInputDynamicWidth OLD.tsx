import { ReactElement, useEffect, useState } from "react";
import { useMeasure } from "react-use";
import * as DOMPurify from "dompurify";
import { uid } from "uid";

const TextInputDynamicWidth = ({
  initialValue,
  onUpdate,
  placeholder,
  disabled = false,
  minWidth = 50,
  trailingSpace = 10,
  id = uid(),
  children,
}: {
  initialValue: string | undefined | null;
  onUpdate: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  minWidth?: number;
  trailingSpace?: number;
  id?: string;
  children?:
    | ReactElement
    | (({ isFocused }: { isFocused: boolean }) => ReactElement)
    | null;
}) => {
  const [value, setValue] = useState(initialValue || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const [dummyInputRef, { width: dummyInputWidth }] =
    useMeasure<HTMLParagraphElement>();

  const inputWidth = dummyInputWidth;
  const inputWidthEditing = dummyInputWidth + trailingSpace;

  return (
    <div
      className="relative flex items-center"
      // centerInput && tw`justify-center`,
    >
      <input
        id={id}
        className="max-w-full bg-white "
        // css={[s, tw`max-w-full bg-white  text-transform[inherit]`, inputStyles]}
        style={{
          width: isFocused ? inputWidthEditing : inputWidth,
          minWidth,
        }}
        value={value}
        onBlur={() => {
          setIsFocused(false);
          const clean = DOMPurify.sanitize(value);
          onUpdate(clean);
        }}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        disabled={disabled}
        type="text"
      />
      <p className="invisible absolute whitespace-nowrap" ref={dummyInputRef}>
        {value.length ? value : placeholder}
      </p>
      {!children || isFocused ? null : typeof children === "function" ? (
        <label
          className="absolute left-0 top-1/2 w-full -translate-y-1/2 cursor-text"
          htmlFor={id}
        >
          {children({ isFocused })}
        </label>
      ) : (
        children
      )}
    </div>
  );
};

export default TextInputDynamicWidth;

// const s = tw`outline-none focus:outline-none placeholder:text-gray-placeholder`;
