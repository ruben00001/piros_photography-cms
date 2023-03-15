import { PlusIcon } from "~/components/Icon";
import AddImageMenu from "~/components/image/add-image/menu";
import { useImageTypeContext } from "../_context/ImageType";

const AddImageButton = () => {
  const { setImageContext } = useImageTypeContext();

  return (
    <AddImageMenu
      imageModals={{
        onVisibilityChange: { onOpen: () => setImageContext("body") },
      }}
    >
      <div className="my-btn-action group flex items-center gap-xs rounded-md py-1.5 px-sm text-white">
        <span className="text-sm">
          <PlusIcon weight="bold" />
        </span>
        <span className="text-sm font-medium">Add image</span>
      </div>
    </AddImageMenu>
  );
};

export default AddImageButton;
