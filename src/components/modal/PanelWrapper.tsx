import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type ReactElement } from "react";
import { createPortal } from "react-dom";

export const ModalPanelWrapper = ({
  onClose,
  isOpen,
  children: panelContent,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement;
}) => {
  return createPortal(
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-50/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 grid place-items-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel>{panelContent}</Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>,
    document.body
  );
};
