import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { MyToast, MyTransition } from "~/components/ui-display";
import { MySpinner } from "~/components/ui-elements";
import { ErrorIcon, PlusIcon, TickIcon } from "~/components/ui-elements/Icon";

const AddAlbum = ({ centerButton }: { centerButton?: boolean }) => {
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
      <div className={centerButton ? "flex justify-center" : ""}>
        <button
          className={`my-btn-action group mb-lg  flex items-center gap-xs rounded-md py-1.5 px-sm text-white ${
            formIsOpen ? "opacity-75" : ""
          }`}
          onClick={() => !formIsOpen && openForm()}
          type="button"
        >
          <span className="text-sm">
            <PlusIcon weight="bold" />
          </span>
          <span className="text-sm font-medium">New album</span>
        </button>
      </div>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <div ref={formRef}>
          <TitleForm closeForm={closeForm} />
        </div>
      </animated.div>
    </>
  );
};

export default AddAlbum;

const TitleForm = ({ closeForm }: { closeForm: () => void }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: allAlbums, refetch: refetchAlbums } =
    api.album.albumsPageGetAll.useQuery();

  const createAlbumMutation = api.album.create.useMutation({
    onError: () => {
      toast(<MyToast text="Error creating album" type="error" />);
    },
  });

  const handleSubmit = () => {
    if (!value.length) {
      return;
    }

    createAlbumMutation.mutate(
      { title: value, index: allAlbums?.length },
      {
        async onSuccess() {
          await refetchAlbums();

          setTimeout(() => {
            setValue("");
            closeForm();

            toast(<MyToast text="Album created" type="success" />);

            setTimeout(() => {
              createAlbumMutation.reset();
            }, 200);
          }, 450);
        },
      },
    );
  };

  return (
    <form
      className="relative flex flex-col gap-lg"
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <div className="flex min-w-[300px] flex-col gap-lg rounded-md border px-4">
        <h3 className="border-b border-b-base-300 pt-4 pb-sm leading-6 text-base-content">
          Create album
        </h3>
        <div className="relative rounded-sm border bg-gray-50 py-1 pr-sm">
          <div
            className={`transition-transform duration-75 ease-in-out  ${
              isFocused || !value.length ? "translate-x-xs" : "translate-x-0"
            }`}
          >
            <input
              className="w-full bg-transparent"
              placeholder="Album title"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
        <div className="flex items-center justify-between pb-4">
          <button
            className="my-btn my-btn-neutral"
            type="button"
            onClick={closeForm}
          >
            Cancel
          </button>
          <button className="my-btn my-btn-action" type="submit">
            Submit
          </button>
        </div>
      </div>
      <CreateStatusPanel status={createAlbumMutation.status} />
    </form>
  );
};

const CreateStatusPanel = ({
  status,
}: {
  status: "idle" | "loading" | "error" | "success";
}) => {
  return (
    <MyTransition.ScaleAndOpacity show={status !== "idle"}>
      <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center rounded-md bg-white/70">
        <div className="flex items-center gap-sm">
          {status === "loading" ? (
            <>
              <MySpinner />
              <p className="font-mono">Creating album</p>
            </>
          ) : status === "success" ? (
            <>
              <span className="text-success">
                <TickIcon />
              </span>
              <p className="font-mono">Album created</p>
            </>
          ) : (
            <>
              <span className="text-2xl text-my-error-content">
                <ErrorIcon />
              </span>
              <p className="font-mono">Error creating album</p>
            </>
          )}
        </div>
      </div>
    </MyTransition.ScaleAndOpacity>
  );
};
