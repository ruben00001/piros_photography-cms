import { Dialog, Transition } from "@headlessui/react";
import { forwardRef, Fragment, useState } from "react";
import PanelBody from "./panel-body";

export const useUploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return [isOpen, { openModal, closeModal }] as const;
};

const UploadModal = ({
  closeModal,
  isOpen,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <>
      {/* <div onClick={openModal}>{children}</div> */}
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
                <Panel closeModal={closeModal} />
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
export const Panel = forwardRef<HTMLDivElement, { closeModal: () => void }>(
  ({ closeModal }, ref) => (
    <Dialog.Panel
      className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      ref={ref}
    >
      <Dialog.Title
        as="h3"
        className="border-b border-b-base-300 pb-sm leading-6 text-base-content"
      >
        Upload Image
      </Dialog.Title>
      <div className="mt-md">
        <PanelBody />
      </div>

      {/* <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          Close
        </button>
      </div> */}
    </Dialog.Panel>
  )
);

/* const Panel = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        Upload Image
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </Dialog.Panel>
  );
};
 */
