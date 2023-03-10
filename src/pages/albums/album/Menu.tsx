import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MyMenuItem } from "~/components/Menu";
import { useWarningModalContext } from "~/components/warning-modal/Context";
import { useAlbumsContext } from "~/context/AlbumsState";
import { useAlbumContext } from "~/context/AlbumState";

const AlbumMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-20 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
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
  const { id: albumId } = useAlbumContext();
  const { setActiveAlbumId } = useAlbumsContext();

  return (
    <div className="">
      <MyMenuItem hoverBg="bg-my-alert">
        <WithTooltip text="Delete album">
          <div
            className="text-my-alert-content"
            onClick={() =>
              openWarningModal({ onOpen: () => setActiveAlbumId(albumId) })
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
