/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Popover } from "@headlessui/react";
import { type ReactElement, useState } from "react";
import { usePopper } from "react-popper";
import { Warning } from "phosphor-react";

// * `Popover` does not position itself but needs css/js/usePopper/etc. to do so
// * `Popover.Panel` had a bug where it'd move from its default position to `usePopper's` on initial load - so have handled open/close state manually

// cerate Portal

const WithWarning = ({
  children,
  callbackToConfirm,
  disabled,
  // proceedButtonStyles = `text-white bg-red-warning hover:bg-red-700 hover:text-white border-red-warning hover:border-red-700`,
  warningText = "Are you sure?",
  type = "strong",
}: // width,
{
  callbackToConfirm: () => void;
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  disabled?: boolean;
  warningText?:
    | {
        heading: string;
        body?: string;
      }
    | string;
  proceedButtonStyles?: string;
  type?: "strong" | "moderate";
  width?: string;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "offset", options: { offset: [0, 10] } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });

  if (disabled) {
    return typeof children === "function"
      ? children({ isOpen: false })
      : children;
  }

  // const headingLength = warningText.heading.length
  // const bodyLength = warningText.body?.length || 0
  // const textLongestLength = headingLength > bodyLength ? headingLength : bodyLength

  // const useTextForWidth = textLongestLength <
  // const isWarningTextBody = typeof warningText === "object" && warningText.body;

  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className="grid place-items-center"
              as="div"
              ref={setReferenceElement}
            >
              {typeof children === "function"
                ? children({ isOpen: open })
                : children}
            </Popover.Button>
            <Popover.Panel
              className={`z-50 transition-all duration-75 ease-in-out ${
                open ? "visible opacity-100" : "invisible opacity-0"
              }`}
              style={styles.popper}
              ref={setPopperElement}
              {...attributes}
              static
            >
              {({ close }) => (
                <div className="min-w-[25ch] rounded-md bg-white shadow-lg">
                  <div
                    className={`flex gap-md p-md ${
                      type === "moderate" ? "p-sm pb-xs" : ""
                    }`}
                  >
                    <div className={`flex items-start justify-center`}>
                      <span
                        className={`text-red-warning bg-red-warning rounded-full bg-opacity-10 p-xs text-2xl ${
                          type === "moderate" ? "p-xxs text-xl" : ""
                        }`}
                      >
                        <Warning
                          weight={type === "strong" ? "bold" : "regular"}
                        />
                      </span>
                    </div>
                    {typeof warningText === "string" ? (
                      <h3>{warningText}</h3>
                    ) : (
                      <div>
                        <h3>{warningText.heading}</h3>
                        {warningText.body ? <p>{warningText.body}</p> : null}
                      </div>
                    )}
                  </div>
                  <div>
                    <button onClick={() => close()} type="button">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        callbackToConfirm();
                        close();
                      }}
                      type="button"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              )}
            </Popover.Panel>
            <Popover.Overlay className="my-overlay-light fixed inset-0" />
          </>
        )}
      </Popover>
    </>
  );
};

export default WithWarning;
