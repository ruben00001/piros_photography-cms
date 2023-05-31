import { api } from "~/utils/api";
import {
  AccordionWithButton,
  CreateEntityForm,
  MutationStatusOverlay,
} from "~/components/ui-compounds";
import { WithTooltip } from "~/components/ui-display";
import { HelpIcon } from "~/components/ui-elements";
import { checkIsYoutubeUrl } from "~/helpers/youtube";
import { useAdmin, useToast } from "~/hooks";

const AddVideo = () => {
  const { data: allVideos, refetch: refetchVideos } =
    api.youtubeVideo.getAll.useQuery();

  const toast = useToast();

  const addVideoMutation = api.youtubeVideo.create.useMutation({
    onError() {
      toast.error("Error creating video");
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

    addVideoMutation.mutate(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { index: allVideos!.length, youtubeUrl: inputValue },
      {
        async onSuccess() {
          await refetchVideos();

          setTimeout(() => {
            resetForm();

            closeForm();

            toast.success("Video added");

            setTimeout(() => {
              addVideoMutation.reset();
            }, 200);
          }, 450);
        },
      },
    );
  };

  const { ifAdmin, isAdmin } = useAdmin();

  return (
    <AccordionWithButton buttonText="Add video">
      {({ closeForm }) => (
        <CreateEntityForm
          onSubmit={(inputValue, resetForm) =>
            ifAdmin(() => handleSubmit({ closeForm, inputValue, resetForm }))
          }
        >
          {({ inputValue }) => {
            const isValidInput = checkIsYoutubeUrl(inputValue);
            const isError = inputValue.length && !isValidInput;

            return (
              <>
                <CreateEntityForm.Title text="Add new Video" />
                <CreateEntityForm.Input.Wrapper
                  containerStyles={isError ? "border-my-alert-content" : ""}
                >
                  <CreateEntityForm.Input.Input placeholder="Youtube url" />
                  <YoutubeURLHelp />
                </CreateEntityForm.Input.Wrapper>
                {isError ? <InvalidInputMessage /> : null}
                <CreateEntityForm.Controls
                  onCancel={closeForm}
                  submitIsDisabled={
                    !isAdmin || !inputValue.length || !isValidInput
                  }
                />
                <MutationStatusOverlay
                  status={addVideoMutation.status}
                  text={{
                    creating: "Adding video",
                    error: "Error creating video",
                    success: "Video created",
                  }}
                />
              </>
            );
          }}
        </CreateEntityForm>
      )}
    </AccordionWithButton>
  );
};

export default AddVideo;

const YoutubeURLHelp = () => (
  <WithTooltip
    text="simply copy the url from the url bar of a youtube video"
    type="info"
  >
    <span className="absolute -right-sm top-1/2 -translate-y-1/2 translate-x-full cursor-help rounded-full p-xxs text-gray-400 hover:bg-gray-100">
      <HelpIcon />
    </span>
  </WithTooltip>
);

const InvalidInputMessage = () => (
  <p className="text-xs text-my-alert-content">
    Input isn&apos;t a valid youtube url
  </p>
);
