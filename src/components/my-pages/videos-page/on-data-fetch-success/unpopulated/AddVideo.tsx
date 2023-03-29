import { useState } from "react";
import { Transition } from "@headlessui/react";
import { animated, useSpring } from "@react-spring/web";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { ErrorIcon, HelpIcon, PlusIcon, TickIcon } from "~/components/Icon";
import Spinner from "~/components/Spinner";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import { checkIsYoutubeUrl } from "~/helpers/youtube";

const AddVideo = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);

  const [formRef, { height: formHeight }] = useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const openForm = () => {
    api.start({
      from: { height: "0px", opacity: 0 },
      to: { height: `${formHeight + 10}px`, opacity: 100 },
    });
    setFormIsOpen(true);
  };
  const closeForm = () => {
    api.start({
      from: { height: `${formHeight + 10}px`, opacity: 100 },
      to: { height: "0px", opacity: 0 },
    });
    setFormIsOpen(false);
  };

  return (
    <>
      <button
        className={`my-btn-action group mb-sm flex items-center gap-xs rounded-md py-1.5 px-sm text-white ${
          formIsOpen ? "pointer-events-none cursor-auto opacity-75" : ""
        }`}
        onClick={() => !formIsOpen && openForm()}
        type="button"
      >
        <span className="text-sm">
          <PlusIcon weight="bold" />
        </span>
        <span className="text-sm font-medium">Add video</span>
      </button>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <div ref={formRef}>
          <YoutubeUrlForm closeForm={closeForm} />
        </div>
      </animated.div>
    </>
  );
};

export default AddVideo;

const YoutubeUrlForm = ({ closeForm }: { closeForm: () => void }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputValueIsInvalidYoutubeURL =
    inputValue.length && !checkIsYoutubeUrl(inputValue);

  const cantSubmit = !inputValue.length || inputValueIsInvalidYoutubeURL;

  const { data: allVideos, refetch: refetchVideos } =
    api.youtubeVideo.getAll.useQuery();

  const addVideoMutation = api.youtubeVideo.create.useMutation({
    onError: () => {
      toast(<Toast text="Error creating video" type="error" />);
    },
  });

  const handleSubmit = () => {
    if (cantSubmit) {
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

            toast(<Toast text="Video added" type="success" />);

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
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <div className="min-w-[250px] rounded-md px-2xl">
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
              cantSubmit ? "cursor-not-allowed opacity-50" : ""
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
            <Spinner />
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
