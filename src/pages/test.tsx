import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import MyModal from "~/components/MyModal";

const Test = () => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("isOpen:", isOpen);

  return (
    <div>
      <MyModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="bg-white">HELLO</div>
      </MyModal>
      <button onClick={() => setIsOpen(true)}>OPEN</button>
      <MyModal2 />
      <MyDialog />
    </div>
  );
};

export default Test;

const MyModal2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </Transition.Child>
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
            <div>MODAL 2</div>
            <button onClick={() => setIsOpen(false)}>CLOSE 2</button>
          </div>
        </Dialog>
      </Transition>
      <button onClick={() => setIsOpen(true)}>OPEN 2</button>
    </>
  );
};

function MyDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
              <div>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
                  <Dialog.Title>Complete your order</Dialog.Title>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <button onClick={() => setIsOpen(true)}>OPEN 3</button>
    </>
  );
}
