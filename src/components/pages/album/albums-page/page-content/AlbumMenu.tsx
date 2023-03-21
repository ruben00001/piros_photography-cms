import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MenuItem } from "~/components/MyMenu";
import { Modal, WarningPanel } from "~/components/modal";
// import { useAlbumContext } from "../_context/AlbumState";

const AlbumMenu = () => {
  // const album = useAlbumContext();

  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
      <MyMenu
        button={({ isOpen }) => (
          <WithTooltip text="Album menu" placement="top" isDisabled={isOpen}>
            <div className="">
              <MenuIcon />
            </div>
          </WithTooltip>
        )}
        styles={{ itemsWrapper: "right-0" }}
      >
        <MenuItem>
          <DeleteModal />
        </MenuItem>
      </MyMenu>
    </div>
  );
};

export default AlbumMenu;

const DeleteModal = () => {
  return (
    <Modal
      button={({ open }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert"
          onClick={open}
        >
          <WithTooltip text="Delete album" yOffset={15}>
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
            title: "Delete album",
          }}
        />
      )}
    />
  );
};
