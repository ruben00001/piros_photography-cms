import { type ReactElement } from "react";
import { Menu } from "@headlessui/react";

import { MyTransition } from "./MyTransition";

export const MyMenu = ({
  button,
  children,
  styles,
}: {
  button: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  children: ReactElement | ReactElement[];
  styles?: { buttonWrapper?: string; itemsWrapper?: string };
}) => (
  <Menu>
    {({ open: isOpen }) => (
      <>
        <Menu.Button className={styles?.buttonWrapper}>
          {typeof button === "function" ? button({ isOpen }) : button}
        </Menu.Button>
        <MyTransition.ScaleAndOpacity>
          <Menu.Items
            className={`absolute z-50 origin-top-right rounded-md bg-white shadow-xl focus:outline-none ${
              styles?.itemsWrapper || ""
            }`}
          >
            <div className="px-1 py-1">{children}</div>
          </Menu.Items>
        </MyTransition.ScaleAndOpacity>
      </>
    )}
  </Menu>
);

MyMenu.Item = Menu.Item;
