import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumContext } from "~/components/+my-pages/album/_context";
import { DataTextAreaForm, DataTextInputForm } from "~/components/ui-compounds";
import { MyToast } from "~/components/ui-display";

const About = () => {
  return (
    <div>
      <Title />
      <Description />
    </div>
  );
};

export default About;

const Title = () => {
  const album = useAlbumContext();

  const updateTitle = api.album.updateTitle.useMutation({
    onSuccess: () => {
      toast(<MyToast text="Title updated" type="success" />);
    },
    onError: () => {
      toast(
        <MyToast text="Something went wrong updating the title" type="error" />,
      );
    },
  });

  return (
    <div className="text-2xl">
      <DataTextInputForm
        onSubmit={({ inputValue, onSuccess }) => {
          updateTitle.mutate(
            { albumId: album.id, updatedTitle: inputValue },
            { onSuccess },
          );
        }}
        input={{ initialValue: album.title, placeholder: "Album title..." }}
        tooltip={{ text: "update title" }}
      />
    </div>
  );
};

const Description = () => {
  const album = useAlbumContext();

  const updateDescriptionMutation = api.album.updateDescription.useMutation({
    onSuccess: () => {
      toast(<MyToast text="Description updated" type="success" />);
    },
    onError: () => {
      toast(
        <MyToast
          text="Something went wrong updating the description"
          type="error"
        />,
      );
    },
  });

  return (
    <div className="max-w-[700px] font-serif text-lg">
      <DataTextAreaForm
        onSubmit={({ inputValue, onSuccess }) =>
          updateDescriptionMutation.mutate(
            {
              albumId: album.id,
              updatedDescription: inputValue,
            },
            { onSuccess },
          )
        }
        tooltipText="click to edit"
        initialValue={album.description}
        placeholder="Album description (optional)"
      />
    </div>
  );
};
