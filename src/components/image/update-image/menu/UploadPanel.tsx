import {
  ModalPanelWrapper,
  Props as PanelProps,
} from "~/components/modal/PanelWrapper";
import { MyOmit } from "~/types/utilities";

const UploadPanel = (props: MyOmit<PanelProps, "children">) => {
  return (
    <ModalPanelWrapper {...props}>
      <div className="bg-white">Upload Panel</div>
    </ModalPanelWrapper>
  );
};

export default UploadPanel;
