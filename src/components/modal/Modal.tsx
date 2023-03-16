import { ReactElement } from "react";
import { ModalPanelWrapper } from "./PanelWrapper";
import { ModalVisibilityProvider } from "./VisibiltyContext";

export const Modal = ({
  button,
  panelContent,
  styles,
}: {
  button: (arg0: { open: () => void }) => ReactElement;
  panelContent: (arg0: { close: () => void }) => ReactElement;
  styles?: { parentPanel?: string };
}) => {
  return (
    <ModalVisibilityProvider>
      {({ open, close, isOpen }) => (
        <>
          {button({ open })}
          <ModalPanelWrapper isOpen={isOpen} onClose={close} styles={styles}>
            {panelContent({ close })}
          </ModalPanelWrapper>
        </>
      )}
    </ModalVisibilityProvider>
  );
};
