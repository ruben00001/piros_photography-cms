import { type AlbumImage } from "../../../_types";

import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, ExpandIcon } from "~/components/Icon";
import MyCldImage from "~/components/image/MyCldImage";
import { Modal, WarningPanel } from "~/components/modal";
import ImageModalPanel from "./ImageModalPanel";
import { AlbumImageProvider } from "../../../_context/AlbumImageState";
import UpdateImageMenu from "~/components/image/update-image/menu-old";

const AlbumImage = ({ albumImage }: { albumImage: AlbumImage }) => {
  return (
    <AlbumImageProvider albumImage={albumImage}>
      <div className="group/albumImage relative">
        <MyCldImage
          fit="object-cover"
          heightSetByContainer={{
            isSetByContainer: false,
            approxVal: 800,
          }}
          src={albumImage.image.cloudinary_public_id}
        />
        <Menu />
      </div>
    </AlbumImageProvider>
  );
};

export default AlbumImage;

const Menu = () => {
  return (
    <div className="absolute right-1 top-1 z-20 flex items-center gap-sm rounded-md bg-white py-xxs px-xs opacity-0 shadow-lg transition-opacity duration-75 ease-in-out hover:!opacity-100 group-hover/albumImage:opacity-50">
      <OpenAlbumImageModal />
      <DeleteModal />
    </div>
  );
};

const OpenAlbumImageModal = () => {
  return (
    <Modal
      button={({ open }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm text-base-300 transition-all duration-75 ease-in-out hover:bg-gray-100 hover:brightness-90 group-hover/albumImage:text-base-content"
          onClick={open}
        >
          <WithTooltip text="Open image" yOffset={15}>
            <span className="">
              <ExpandIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={() => <ImageModalPanel />}
      // styles={{ parentPanel: "w-full" }}
    />
  );
};

const UpdateImage = () => {
  return (
    <UpdateImageMenu>
      <div className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert">
        <WithTooltip text="Delete album image" yOffset={15}>
          <span className="text-my-alert-content">
            <DeleteIcon />
          </span>
        </WithTooltip>
      </div>
    </UpdateImageMenu>
  );
};

const DeleteModal = () => {
  return (
    <Modal
      button={({ open }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert"
          onClick={open}
        >
          <WithTooltip text="Delete album image" yOffset={15}>
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={({ close }) => (
        <WarningPanel
          callback={{ func: () => null }}
          closeModal={close}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete album image",
          }}
        />
      )}
    />
  );
};
