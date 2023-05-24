import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/albums/_context";
import { MyMenu, MyModal, WithTooltip } from "~/components/ui-display";
import { ComponentMenuIcon, DeleteIcon } from "~/components/ui-elements";
import { WarningPanel } from "~/components/ui-written";
import { useAdmin, useToast } from "~/hooks";

const AlbumMenu = () => (
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

export default AlbumMenu;

const DeleteModal = () => {
  const album = useAlbumContext();

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const deleteMutation = api.album.delete.useMutation({
    async onSuccess() {
      await refetchAlbums();

      toast.success("deleted album");
    },
    onError() {
      toast.error("delete album failed");
    },
  });

  const { ifAdmin } = useAdmin();

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
              ifAdmin(() =>
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
