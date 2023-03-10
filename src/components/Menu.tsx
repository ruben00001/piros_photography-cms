import { Fragment, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";

const MyMenu = ({
  button,
  buttonWrapperClasses,
  itemsWrapperClasses,
  items,
}: {
  button: ReactElement;
  buttonWrapperClasses?: string;
  itemsWrapperClasses?: string;
  items: ReactElement;
}) => {
  return (
    <div className="relative z-10">
      <Menu>
        <>
          <Menu.Button className={buttonWrapperClasses}>{button}</Menu.Button>
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
              className={`absolute rounded-md bg-white py-xxs px-xs shadow-lg ${
                itemsWrapperClasses || ""
              }`}
            >
              {/* <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"> */}
              <div className="">{items}</div>
            </Menu.Items>
          </Transition>
        </>
      </Menu>
    </div>
  );
};

export default MyMenu;

export const MyMenuItem = ({
  children,
  hoverBg = "bg-base-200",
}: {
  children: ReactElement | ReactElement[];
  hoverBg?: string;
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <div
          className={`${
            active ? hoverBg : ""
          } group flex w-full cursor-pointer items-center gap-4 rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </div>
      )}
    </Menu.Item>
  );
};
