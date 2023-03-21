import { useEffect, type ReactElement } from "react";
import { ModalPanelWrapper } from "./PanelWrapper";
import { ModalVisibilityProvider } from "./VisibiltyContext";

export const Modal = ({
  button,
  panelContent,
  styles,
  onVisibilityChange,
}: {
  button: (arg0: { open: () => void }) => ReactElement;
  panelContent: (arg0: { close: () => void }) => ReactElement;
  styles?: { parentPanel?: string };
  onVisibilityChange?: { open?: () => void; close?: () => void };
}) => {
  return (
    <ModalVisibilityProvider>
      {({ open, close, isOpen }) => (
        <>
          {button({ open })}
          <ModalPanelWrapper isOpen={isOpen} closeModal={close} styles={styles}>
            {panelContent({ close })}
          </ModalPanelWrapper>
          {onVisibilityChange ? (
            <OnVisibilityChange
              modalIsOpen={isOpen}
              onVisibilityChange={onVisibilityChange}
            />
          ) : null}
        </>
      )}
    </ModalVisibilityProvider>
  );
};

const OnVisibilityChange = ({
  modalIsOpen,
  onVisibilityChange,
}: {
  modalIsOpen: boolean;
  onVisibilityChange: { open?: () => void; close?: () => void };
}) => {
  useEffect(() => {
    if (modalIsOpen && onVisibilityChange.open) {
      onVisibilityChange.open();
    }
    if (!modalIsOpen && onVisibilityChange.close) {
      onVisibilityChange.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);
  return <></>;
};
