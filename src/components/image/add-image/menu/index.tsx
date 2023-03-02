import { Fragment, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ImageIcon, UploadIcon } from "~/components/Icon";
import UploadModal, { useUploadModal } from "../upload-modal";

const AddImageMenu = ({ children }: { children: ReactElement }) => {
  const [uploadModalIsOpen, { closeModal, openModal }] = useUploadModal();

  return (
    <div className="relative z-10">
      <Menu>
        <Menu.Button>{children}</Menu.Button>
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
                <span>
                  <ImageIcon />
                </span>
                <span>Use uploaded</span>
              </MenuItem>
              <MenuItem>
                <button
                  className="flex items-center gap-4"
                  onClick={openModal}
                  type="button"
                >
                  <span>
                    <UploadIcon />
                  </span>
                  <span>Upload new</span>
                </button>
              </MenuItem>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <UploadModal closeModal={closeModal} isOpen={uploadModalIsOpen} />
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
            active ? "bg-violet-500 text-white" : "text-gray-900"
          } group flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};
