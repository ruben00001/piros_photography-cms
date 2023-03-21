import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MenuItem } from "~/components/MyMenu";
import { Modal, WarningPanel } from "~/components/modal";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import Toast from "~/components/data-display/Toast";
import { useAlbumContext } from "../_context/AlbumState";

const AlbumMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
      <MyMenu
        button={({ isOpen }) => (
          <WithTooltip text="Album menu" placement="top" isDisabled={isOpen}>
            <div className="transition-colors duration-75 ease-in-out hover:!text-gray-700 group-hover/album:text-gray-300">
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
  const album = useAlbumContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const deleteMutation = api.album.delete.useMutation({
    onSuccess: async () => {
      await refetchAlbums();

      toast(<Toast text="deleted album" type="success" />);
    },
    onError: () => {
      toast(<Toast text="delete album failed" type="error" />);
    },
  });

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
      panelContent={({ close: closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              deleteMutation.mutate(
                {
                  album: { id: album.id, index: album.index },
                },
                {
                  onSuccess() {
                    closeModal();
                  },
                }
              ),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete album",
          }}
        />
      )}
    />
  );
};
