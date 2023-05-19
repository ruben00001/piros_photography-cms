import { api } from "~/utils/api";
import {
  CollapsableSectionWithButton,
  CreateEntityFormWithSingleInput,
  MutationStatusOverlay,
} from "~/components/ui-compounds";
import { WithTooltip } from "~/components/ui-display";
import { HelpIcon } from "~/components/ui-elements";
import { checkIsYoutubeUrl } from "~/helpers/youtube";
import useAdmin from "~/hooks/useAdmin";
import useToast from "~/hooks/useToast";

const AddVideo = () => {
  return (
    <CollapsableSectionWithButton buttonText="Add video">
      {({ closeSection }) => <YoutubeUrlForm closeForm={closeSection} />}
    </CollapsableSectionWithButton>
  );
};

export default AddVideo;

const YoutubeUrlForm = ({ closeForm }: { closeForm: () => void }) => {
  const { data: allVideos, refetch: refetchVideos } =
    api.youtubeVideo.getAll.useQuery();

  const toast = useToast();

  const addVideoMutation = api.youtubeVideo.create.useMutation({
    onError() {
      toast.error("Error creating video");
    },
  });

  const { ifAdmin, isAdmin } = useAdmin();

  const handleSubmit = (inputValue: string, resetForm: () => void) => {
    const inputValueIsInvalidYoutubeURL =
      inputValue.length && !checkIsYoutubeUrl(inputValue);

    if (!inputValue.length || inputValueIsInvalidYoutubeURL) {
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

  return (
    <CreateEntityFormWithSingleInput
      mutationStatusOverlay={
        <MutationStatusOverlay
          status={addVideoMutation.status}
          text={{
            creating: "Adding video",
            error: "Error creating video",
            success: "Video created",
          }}
        />
      }
      onCancelButtonClick={closeForm}
      onSubmit={(...args) => ifAdmin(() => handleSubmit(...args))}
      submitIsDisabled={(inputValue) =>
        !isAdmin || checkIsYoutubeUrl(inputValue)
      }
      text={{ placeholder: "Youtube url", title: "Add new video" }}
      elements={{
        input: <YoutubeURLHelp />,
        inputMessage: (
          <p className="text-xs text-my-alert-content">
            Input isn&apos;t a valid youtube url
          </p>
        ),
      }}
      computeIsInputError={(inputValue) =>
        Boolean(inputValue.length && !checkIsYoutubeUrl(inputValue))
      }
    />
  );
};

const YoutubeURLHelp = () => {
  return (
    <WithTooltip
      text="simply copy the url from the url bar of a youtube video"
      type="info"
    >
      <span className="absolute -right-sm top-1/2 -translate-y-1/2 translate-x-full cursor-help rounded-full p-xxs text-gray-400 hover:bg-gray-100">
        <HelpIcon />
      </span>
    </WithTooltip>
  );
};

/* const YoutubeUrlFormOld = ({ closeForm }: { closeForm: () => void }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputValueIsInvalidYoutubeURL =
    inputValue.length && !checkIsYoutubeUrl(inputValue);

  const cantSubmit = !inputValue.length || inputValueIsInvalidYoutubeURL;

  const { data: allVideos, refetch: refetchVideos } =
    api.youtubeVideo.getAll.useQuery();

  const addVideoMutation = api.youtubeVideo.create.useMutation({
    onError: () => {
      toast(<MyToast text="Error creating video" type="error" />);
    },
  });

  const isAdmin = useIsAdmin();

  const handleSubmit = () => {
    if (!isAdmin) {
      return;
    }

    if (!inputValue.length || inputValueIsInvalidYoutubeURL) {
      return;
    }

    addVideoMutation.mutate(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { index: allVideos!.length, youtubeUrl: inputValue },
      {
        async onSuccess() {
          await refetchVideos();

          setTimeout(() => {
            setInputValue("");
            closeForm();

            toast(<MyToast text="Video added" type="success" />);

            setTimeout(() => {
              addVideoMutation.reset();
            }, 200);
          }, 450);
        },
      },
    );
  };

  return (
    <form
      className="relative pr-2xl"
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <div className="min-w-[250px] rounded-md">
        <p className="mb-xs text-sm text-gray-300">Add new video</p>
        <div
          className={`relative rounded-sm border bg-gray-50  py-1 pr-sm ${
            inputValueIsInvalidYoutubeURL ? "border-my-alert-content" : ""
          }`}
        >
          <YoutubeURLHelp />
          <div
            className={`transition-transform duration-75 ease-in-out  ${
              isFocused || !inputValue.length
                ? "translate-x-xs"
                : "translate-x-0"
            }`}
          >
            <input
              className="w-full bg-transparent text-base"
              placeholder="Youtube url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
        {inputValueIsInvalidYoutubeURL ? (
          <p className="text-xs text-my-alert-content">
            Input isn&apos;t a valid youtube url
          </p>
        ) : null}
        <div className="mt-sm flex items-center justify-between pb-4">
          <button
            className="my-btn my-btn-neutral"
            type="button"
            onClick={closeForm}
          >
            Cancel
          </button>
          <button
            className={`my-btn my-btn-action ${
              !isAdmin || cantSubmit ? "cursor-not-allowed opacity-50" : ""
            }`}
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
      <CreateStatusPanel status={addVideoMutation.status} />
    </form>
  );
};

const CreateStatusPanel = ({
  status,
}: {
  status: "idle" | "loading" | "error" | "success";
}) => {
  return (
    <Transition
      as={"div"}
      show={status !== "idle"}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center rounded-md bg-white/70"
    >
      <div className="flex items-center gap-sm">
        {status === "loading" ? (
          <>
            <MySpinner />
            <p className="font-mono">Adding video</p>
          </>
        ) : status === "success" ? (
          <>
            <span className="text-success">
              <TickIcon />
            </span>
            <p className="font-mono">Video created</p>
          </>
        ) : (
          <>
            <span className="text-2xl text-my-error-content">
              <ErrorIcon />
            </span>
            <p className="font-mono">Error creating video</p>
          </>
        )}
      </div>
    </Transition>
  );
};

 */
