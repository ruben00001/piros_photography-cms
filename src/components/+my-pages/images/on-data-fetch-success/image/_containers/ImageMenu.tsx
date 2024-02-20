import { type ReactElement } from "react";

import { WithTooltip } from "~/components/ui-display";

export function ImageMenu({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <div
      className={`absolute right-1 top-1 z-20 flex items-center gap-sm rounded-md bg-white py-xxs px-xs opacity-0 shadow-lg transition-opacity duration-75 ease-in-out hover:!opacity-100 group-hover/image:opacity-50`}
    >
      {children}
    </div>
  );
}

function Button({
  icon,
  onClick,
  tooltipText,
}: {
  onClick: () => void;
  tooltipText: string;
  icon: ReactElement;
}) {
  return (
    <WithTooltip text={tooltipText} yOffset={15}>
      <div
        className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/image:text-base-content"
        onClick={onClick}
      >
        <span className="">{icon}</span>
      </div>
    </WithTooltip>
  );
}

ImageMenu.Button = Button;
