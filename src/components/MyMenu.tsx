import { Fragment, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";

const MyMenu = ({
  button,
  children,
  styles,
}: {
  button: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  children: ReactElement[];
  styles?: { buttonWrapper?: string; itemsWrapper?: string };
}) => {
  return (
    <Menu>
      {({ open: isOpen }) => (
        <>
          <Menu.Button className={styles?.buttonWrapper}>
            {typeof button === "function" ? button({ isOpen }) : button}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={`absolute z-20 origin-top-right rounded-md bg-white shadow-xl focus:outline-none ${styles?.itemsWrapper}`}
            >
              <div className="px-1 py-1">
                {children.map((child) => (
                  <Menu.Item>{child}</Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default MyMenu;
