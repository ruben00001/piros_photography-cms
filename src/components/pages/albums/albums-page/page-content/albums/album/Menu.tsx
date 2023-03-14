import { useAlbumsContext } from "../../../_context/AlbumsState";
import { useAlbumContext } from "../../../_context/AlbumState";

import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MyMenuItem } from "~/components/Menu";
import { useWarningModalContext } from "~/components/warning-modal/Context";

const AlbumMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
      <MyMenu
        button={<Button />}
        items={<Items />}
        itemsWrapperClasses="right-0"
      />
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

const Items = () => {
  const { openModal: openWarningModal } = useWarningModalContext();
  const album = useAlbumContext();
  const { setActiveAlbum } = useAlbumsContext();

  return (
    <div className="">
      <MyMenuItem hoverBg="bg-my-alert">
        <WithTooltip text="Delete album">
          <div
            className="text-my-alert-content"
            onClick={() =>
              openWarningModal({ onOpen: () => setActiveAlbum(album) })
            }
          >
            <DeleteIcon />
          </div>
        </WithTooltip>
      </MyMenuItem>
    </div>
  );
};

{
  /* warningText={{ heading: "Delete album", body: "Are you sure?" }} */
}
