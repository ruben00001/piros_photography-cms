import { forwardRef } from "react";

import { WithTooltip } from "../ui-display";
import { DeleteIcon } from "../ui-elements";

type Props = {
  onClick: () => void;
  isDisabled: boolean;
  entityName: string;
};

export const DeleteEntityButton = forwardRef<HTMLDivElement, Props>(
  ({ entityName, isDisabled, onClick }, ref) => (
    <div
      className={`rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert 
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={onClick}
      ref={ref}
    >
      <WithTooltip text={`Delete ${entityName}`} yOffset={15}>
        <span
          className={`text-my-alert-content ${
            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <DeleteIcon />
        </span>
      </WithTooltip>
    </div>
  ),
);

DeleteEntityButton.displayName = "DeleteEntityButton";
