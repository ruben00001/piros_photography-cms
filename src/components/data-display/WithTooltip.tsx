/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { cloneElement, type ReactElement } from "react";
import { usePopperTooltip, type Config } from "react-popper-tooltip";

export type Props = {
  yOffset?: number;
  children: ReactElement;
  placement?: Config["placement"];
  text:
    | string
    | {
        header: string;
        body: string;
      };
  isDisabled?: boolean;
  type?: "info" | "action" | "extended-info";
};

const WithTooltip = ({
  children,
  placement = "auto",
  text,
  isDisabled = false,
  yOffset = 10,
  type = "info",
}: Props) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ delayShow: 700, placement, offset: [0, yOffset] });

  const show = visible && !isDisabled;

  return (
    <>
      {cloneElement(children, {
        ...children.props,
        ref: setTriggerRef,
      })}
      <div
        className={`z-20 whitespace-nowrap rounded-sm font-sans text-sm transition-opacity duration-75 ease-in-out ${
          !show ? "invisible opacity-0" : "visible opacity-100"
        }`}
        {...getTooltipProps()}
        ref={setTooltipRef}
      >
        {typeof text === "string" ? (
          <div
            className={`py-0.5 px-2 ${
              type === "extended-info"
                ? "border border-info text-info-content"
                : type === "action"
                ? "border border-accent text-accent-content"
                : "bg-neutral-focus text-white"
            }`}
          >
            {text}
          </div>
        ) : (
          <div className="gap-xxs flex w-[30ch] flex-col whitespace-normal border border-gray-600 bg-[#fafafa] py-0.5 px-2 text-left text-gray-700">
            <p className="font-medium capitalize">{text.header}</p>
            <p className="text-gray-600">{text.body}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default WithTooltip;
