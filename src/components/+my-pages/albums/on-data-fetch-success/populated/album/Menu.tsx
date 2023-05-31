import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/albums/_context";
import {
  DeleteEntityButton,
  EntityCardSeeMoreMenu,
} from "~/components/ui-compounds";
import { MyMenu, MyModal } from "~/components/ui-display";
import { WarningPanel } from "~/components/ui-written";
import { useAdmin, useToast } from "~/hooks";

const AlbumMenu = () => (
  <EntityCardSeeMoreMenu entityName="Album">
    <MyMenu.Item>
      <div>
        <DeleteModal />
      </div>
    </MyMenu.Item>
  </EntityCardSeeMoreMenu>
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

  const { ifAdmin, isAdmin } = useAdmin();

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <DeleteEntityButton
          entityName="album"
          isDisabled={!isAdmin}
          onClick={openModal}
        />
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
