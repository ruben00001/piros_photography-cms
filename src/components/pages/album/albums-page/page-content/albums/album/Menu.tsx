import { useAlbumsContext } from "../../../_context/AlbumsState";
import { useAlbumContext } from "../../../_context/AlbumState";

import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MenuItem } from "~/components/MyMenu";
import { useWarningModalContext } from "~/components/warning-modal/Context";

const AlbumMenu = () => {
  const { openModal: openWarningModal } = useWarningModalContext();
  const album = useAlbumContext();
  const { setActiveAlbum } = useAlbumsContext();

  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
      <MyMenu button={<Button />} styles={{ itemsWrapper: "right-0" }}>
        <MenuItem>
          <div className="cursor-pointer rounded-md bg-my-alert px-2 py-2 text-sm">
            <WithTooltip text="Delete album" yOffset={15}>
              <div
                className="text-my-alert-content"
                onClick={() =>
                  openWarningModal({ onOpen: () => setActiveAlbum(album) })
                }
              >
                <DeleteIcon />
              </div>
            </WithTooltip>
          </div>
        </MenuItem>
      </MyMenu>
    </div>
  );
};

export default AlbumMenu;

const Button = () => {
  return (
    <WithTooltip text="Album menu" placement="top">
      <div>
        <MenuIcon />
      </div>
    </WithTooltip>
  );
};
