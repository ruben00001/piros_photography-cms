import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/album/_context";
import {
  CollapsableSection,
  DataTextAreaForm,
  DataTextInputForm,
} from "~/components/ui-compounds";
import { useAdmin, useToast } from "~/hooks";

const About = () => (
  <>
    <Title />
    <Description />
  </>
);

export default About;

const Title = () => {
  const album = useAlbumContext();

  const toast = useToast();

  const updateTitle = api.album.updateTitle.useMutation({
    onSuccess() {
      toast.success("Title updated");
    },
    onError() {
      toast.error("Something went wrong updating the title");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <div className="text-2xl">
      <DataTextInputForm
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() => {
            updateTitle.mutate(
              { albumId: album.id, updatedTitle: inputValue },
              { onSuccess },
            );
          })
        }
        input={{ initialValue: album.title, placeholder: "Album title..." }}
        tooltip={{ text: "update title" }}
      />
    </div>
  );
};

const Description = () => {
  const album = useAlbumContext();

  const toast = useToast();

  const updateDescriptionMutation = api.album.updateDescription.useMutation({
    onSuccess() {
      toast.success("Description updated");
    },
    onError() {
      toast.error("Something went wrong updating the description");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <CollapsableSection showSectionText="Show album description">
      <div className="max-w-[700px] font-serif text-lg">
        <DataTextAreaForm
          onSubmit={({ inputValue, onSuccess }) =>
            ifAdmin(() =>
              updateDescriptionMutation.mutate(
                {
                  albumId: album.id,
                  updatedDescription: inputValue,
                },
                { onSuccess },
              ),
            )
          }
          tooltipText="click to edit"
          initialValue={album.description}
          placeholder="Album description (optional)"
        />
      </div>
    </CollapsableSection>
  );
};
