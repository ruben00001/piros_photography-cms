import { type ReactElement } from "react";

import DefaultModal from "./MyModal";
import {
  ModalVisibilityProvider,
  useModalVisibilityContext,
} from "./VisibiltyContext";

export const MyModal = () => {
  return <></>;
};

MyModal.Provider = ModalVisibilityProvider;
MyModal.useProvider = useModalVisibilityContext;
MyModal.Default = DefaultModal;

const DefaultButtonAndPanel = ({
  button,
  panelContent,
  styles,
}: {
  button: ((arg0: { openModal: () => void }) => ReactElement) | ReactElement;
  panelContent:
    | ReactElement
    | ((arg0: { closeModal: () => void }) => ReactElement);
  styles?: { parentPanel?: string };
}) => (
  <MyModal.Provider>
    {({ openModal, closeModal, isOpen }) => (
      <>
        {typeof button === "function" ? button({ openModal }) : button}
        <MyModal.Default
          isOpen={isOpen}
          closeModal={closeModal}
          styles={styles}
        >
          {typeof panelContent === "function"
            ? panelContent({ closeModal })
            : panelContent}
        </MyModal.Default>
      </>
    )}
  </MyModal.Provider>
);

MyModal.DefaultButtonAndPanel = DefaultButtonAndPanel;
