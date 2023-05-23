import { api } from "~/utils/api";
import {
  AccordionWithButton,
  CreateEntityFormWithSingleInput2 as CreateEntityForm,
  MutationStatusOverlay,
} from "~/components/ui-compounds";
import useAdmin from "~/hooks/useAdmin";
import useToast from "~/hooks/useToast";

const AddAlbum = () => {
  const { data: allAlbums, refetch: refetchAlbums } =
    api.album.albumsPageGetAll.useQuery();

  const toast = useToast();

  const createAlbumMutation = api.album.create.useMutation({
    onError() {
      toast.error("Error creating album");
    },
  });

  const handleSubmit = ({
    closeForm,
    inputValue,
    resetForm,
  }: {
    inputValue: string;
    resetForm: () => void;
    closeForm: () => void;
  }) => {
    if (!inputValue.length) {
      return;
    }

    createAlbumMutation.mutate(
      { title: inputValue, index: allAlbums?.length },
      {
        async onSuccess() {
          await refetchAlbums();

          setTimeout(() => {
            resetForm();

            closeForm();

            setTimeout(() => {
              createAlbumMutation.reset();
            }, 200);
          }, 450);
        },
      },
    );
  };

  const { ifAdmin, isAdmin } = useAdmin();

  return (
    <AccordionWithButton buttonText="New album">
      {({ closeForm }) => (
        <CreateEntityForm
          onSubmit={(inputValue, resetForm) =>
            ifAdmin(() => handleSubmit({ closeForm, inputValue, resetForm }))
          }
        >
          <CreateEntityForm.Title text="Create new album" />
          <CreateEntityForm.Input.Wrapper>
            <CreateEntityForm.Input.Input placeholder="Album title" />
          </CreateEntityForm.Input.Wrapper>
          <CreateEntityForm.Controls
            onCancel={closeForm}
            submitIsDisabled={!isAdmin}
          />
          <MutationStatusOverlay
            status={createAlbumMutation.status}
            text={{
              creating: "Adding album",
              error: "Error creating album",
              success: "Album created",
            }}
          />
        </CreateEntityForm>
      )}
    </AccordionWithButton>
  );
};

export default AddAlbum;
