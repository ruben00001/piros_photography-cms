import { api } from "~/utils/api";
import { useVideoContext } from "~/components/+my-pages/videos/_context";
import {
  DeleteEntityButton,
  EntityCardSeeMoreMenu,
} from "~/components/ui-compounds";
import { MyMenu, MyModal } from "~/components/ui-display";
import { WarningPanel } from "~/components/ui-written";
import { useAdmin, useToast } from "~/hooks";

const VideoMenu = () => (
  <EntityCardSeeMoreMenu entityName="Video">
    <MyMenu.Item>
      <div>
        <DeleteModal />
      </div>
    </MyMenu.Item>
  </EntityCardSeeMoreMenu>
);

export default VideoMenu;

const DeleteModal = () => {
  const video = useVideoContext();

  const { refetch: refetchVideos } = api.youtubeVideo.getAll.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const toast = useToast();

  const deleteMutation = api.youtubeVideo.delete.useMutation({
    async onSuccess() {
      await refetchVideos();

      toast.success("deleted video");
    },
    onError() {
      toast.error("delete video failed");
    },
  });

  const { isAdmin, ifAdmin } = useAdmin();

  return (
    <MyModal.DefaultButtonAndPanel
      button={({ openModal }) => (
        <DeleteEntityButton
          entityName="video"
          isDisabled={!isAdmin}
          onClick={openModal}
        />
      )}
      panelContent={({ closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              ifAdmin(() => {
                deleteMutation.mutate(
                  {
                    where: { id: video.id, index: video.index },
                  },
                  {
                    onSuccess() {
                      closeModal();
                    },
                  },
                );
              }),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete video",
          }}
        />
      )}
    />
  );
};
