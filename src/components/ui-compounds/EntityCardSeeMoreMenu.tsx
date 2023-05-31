import { type ReactElement } from "react";

import { MyMenu, WithTooltip } from "~/components/ui-display";
import { ComponentMenuIcon } from "~/components/ui-elements";

export const EntityCardSeeMoreMenu = ({
  children,
  entityName,
}: {
  children: ReactElement;
  entityName: string;
}) => (
  <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
    <MyMenu
      button={({ isOpen }) => (
        <WithTooltip
          text={`${entityName} menu`}
          placement="top"
          isDisabled={isOpen}
        >
          <div className="transition-colors duration-75 ease-in-out hover:!text-gray-700 group-hover/album:text-gray-300">
            <ComponentMenuIcon />
          </div>
        </WithTooltip>
      )}
      styles={{ itemsWrapper: "right-0" }}
    >
      {children}
    </MyMenu>
  </div>
);
