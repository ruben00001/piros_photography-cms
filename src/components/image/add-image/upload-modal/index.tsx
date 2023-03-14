import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import MyModal from "~/components/MyModal";

import {
  UploadModalProvider,
  type ModalState,
} from "~/context/UploadModalState";
import { useUploadModalVisibilityContext } from "~/context/UploadModalVisibilityState";
import { type MyPick } from "~/types/utilities";

import Panel from "./panel";

const UploadPanel = ({
  createDbImageFunc,
}: MyPick<ModalState, "createDbImageFunc">) => {
  const { closeModal, isOpen } = useUploadModalVisibilityContext();

  return (
    <MyModal isOpen={isOpen} onClose={closeModal}>
      <Panel />
    </MyModal>
  );
};

export default UploadPanel;
