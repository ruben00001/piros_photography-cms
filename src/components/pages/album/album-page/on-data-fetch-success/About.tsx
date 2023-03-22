import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumContext } from "~/album-page/_context";

import Toast from "~/components/data-display/Toast";
import DataTextAreaForm from "~/components/forms/DataTextAreaForm";
import DataTextInputForm from "~/components/forms/DataTextInputForm";

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
      toast(<Toast text="Title updated" type="success" />);
    },
    onError: () => {
      toast(
        <Toast text="Something went wrong updating the title" type="error" />
      );
    },
  });

  return (
    <div className="text-2xl">
      <DataTextInputForm
        onSubmit={({ inputValue, onSuccess }) => {
          updateTitle.mutate(
            { albumId: album.id, updatedTitle: inputValue },
            { onSuccess }
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
      toast(<Toast text="Description updated" type="success" />);
    },
    onError: () => {
      toast(
        <Toast
          text="Something went wrong updating the description"
          type="error"
        />
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
            { onSuccess }
          )
        }
        tooltipText="click to edit"
        initialValue={album.description}
        placeholder="Album description (optional)"
      />
    </div>
  );
};
