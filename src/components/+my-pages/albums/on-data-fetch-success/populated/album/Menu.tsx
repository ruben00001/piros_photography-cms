import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/albums/_context";
import { MyMenu, MyModal, MyToast, WithTooltip } from "~/components/ui-display";
import { ComponentMenuIcon, DeleteIcon } from "~/components/ui-elements/Icon";
import { WarningPanel } from "~/components/ui-written";

const AlbumMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/album:opacity-100">
      <MyMenu
        button={({ isOpen }) => (
          <WithTooltip text="Album menu" placement="top" isDisabled={isOpen}>
            <div className="transition-colors duration-75 ease-in-out hover:!text-gray-700 group-hover/album:text-gray-300">
              <ComponentMenuIcon />
            </div>
          </WithTooltip>
        )}
        styles={{ itemsWrapper: "right-0" }}
      >
        <MyMenu.Item>
          <DeleteModal />
        </MyMenu.Item>
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
    },
  );

  const deleteMutation = api.album.delete.useMutation({
    onSuccess: async () => {
      await refetchAlbums();

      toast(<MyToast text="deleted album" type="success" />);
    },
    onError: () => {
      toast(<MyToast text="delete album failed" type="error" />);
    },
  });

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert"
          onClick={openModal}
        >
          <WithTooltip text="Delete album" yOffset={15}>
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={({ closeModal }) => (
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
                },
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
