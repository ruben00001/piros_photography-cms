import { Dialog, Transition } from "@headlessui/react";
import { forwardRef, Fragment } from "react";
import { useModalVisibilityContext } from "~/context/ModalVisibilityState";

import PanelBody from "./panel-body";

const UploadModal = () => {
  const { closeModal, isOpen } = useModalVisibilityContext();

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Panel />
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UploadModal;

// eslint-disable-next-line react/display-name
export const Panel = forwardRef<HTMLDivElement>((_, ref) => {
  const { closeModal } = useModalVisibilityContext();

  return (
    <Dialog.Panel
      className="w-full max-w-xl transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      ref={ref}
    >
      <Dialog.Title
        as="h3"
        className="border-b border-b-base-300 pb-sm leading-6 text-base-content"
      >
        Upload Image
      </Dialog.Title>
      <div className="mt-md">
        <PanelBody closeModal={closeModal} />
      </div>
    </Dialog.Panel>
  );
});
