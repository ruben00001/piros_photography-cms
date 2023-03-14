import { Fragment, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";

import { ImageIcon, UploadIcon } from "~/components/Icon";
import { useUploadModalVisibilityContext } from "~/context/UploadModalVisibilityState";
import { useUploadedModalVisibilityContext } from "~/context/UploadedModalVisibilityState";

const AddImageMenu = ({
  children,
  styles,
  imageModals,
}: {
  children: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  styles?: { buttonWrapper?: string };
  imageModals?: { onVisibilityChange?: { onOpen: () => void } };
}) => {
  const { openModal: openUploadModal } = useUploadModalVisibilityContext();
  const { openModal: openUploadedModal } = useUploadedModalVisibilityContext();

  return (
    <div className="relative z-20">
      <Menu>
        {({ open: isOpen }) => (
          <>
            <Menu.Button className={styles?.buttonWrapper}>
              {typeof children === "function" ? children({ isOpen }) : children}
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
              <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <MenuItem>
                    <div
                      className="flex cursor-pointer items-center gap-4"
                      onClick={() => {
                        openUploadedModal(
                          imageModals?.onVisibilityChange && {
                            onOpen() {
                              console.log("HELLO");

                              imageModals.onVisibilityChange!.onOpen();
                            },
                          }
                        );
                      }}
                    >
                      <span>
                        <ImageIcon />
                      </span>
                      <span>Use uploaded</span>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div
                      className="flex cursor-pointer items-center gap-4"
                      onClick={() =>
                        openUploadModal(
                          imageModals?.onVisibilityChange && {
                            onOpen() {
                              imageModals.onVisibilityChange!.onOpen();
                            },
                          }
                        )
                      }
                    >
                      <span>
                        <UploadIcon />
                      </span>
                      <span>Upload new</span>
                    </div>
                  </MenuItem>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default AddImageMenu;

const MenuItem = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-base-200" : ""
          } group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};
