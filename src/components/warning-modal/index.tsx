import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ErrorIcon, TickIcon } from "../Icon";
import MyModal from "../MyModal";
import Spinner from "../Spinner";
import { useWarningModalContext } from "./Context";

const WarningModal = ({
  text,
  onConfirm,
  invokedFuncStatus,
}: {
  text: { title: string; body: string };
  onConfirm: (arg0: { closeModal: () => void }) => void;
  invokedFuncStatus?: "error" | "idle" | "loading" | "success";
}) => {
  const { closeModal, isOpen } = useWarningModalContext();

  return (
    <MyModal
      onClose={() => {
        closeModal();
      }}
      isOpen={isOpen}
    >
      <div
        id="alert-additional-content-4"
        className="min-w-[300px] max-w-xl rounded-lg border border-my-alert-content bg-white p-4 text-my-alert-content shadow-lg"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            aria-hidden="true"
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">{text.title}</h3>
        </div>
        <div className="mt-2 mb-4 text-left text-sm text-base-content">
          {text.body}
        </div>
        <div className="mt-lg flex items-center justify-between">
          <button
            type="button"
            className="my-btn my-btn-neutral"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            type="button"
            className="my-btn my-btn-action"
            data-dismiss-target="#alert-additional-content-4"
            onClick={() => onConfirm({ closeModal })}
          >
            Confirm
          </button>
        </div>
        {invokedFuncStatus ? (
          <Transition
            show={invokedFuncStatus !== "idle"}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute left-0 top-0 z-50 grid h-full w-full place-items-center rounded-md bg-white bg-opacity-90">
              <div className="flex items-center gap-md">
                {invokedFuncStatus === "loading" ? (
                  <>
                    <Spinner />
                    <p className="font-mono text-sm capitalize text-base-content">
                      Loading
                    </p>
                  </>
                ) : invokedFuncStatus === "error" ? (
                  <>
                    <span className="text-my-error-content">
                      <ErrorIcon />
                    </span>
                    <p className="font-mono text-sm text-base-content">
                      Something went wrong
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-my-success-content">
                      <TickIcon />
                    </span>
                    <p className="font-mono text-sm text-base-content">
                      Delete success
                    </p>
                  </>
                )}
              </div>
            </div>
          </Transition>
        ) : null}
      </div>
    </MyModal>
  );
};

export default WarningModal;
