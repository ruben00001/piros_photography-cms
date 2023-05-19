import { MyTransition } from "~/components/ui-display";
import { ErrorIcon, MySpinner, TickIcon } from "~/components/ui-elements";

export const MutationStatusOverlay = ({
  status,
  text,
}: {
  status: "idle" | "loading" | "error" | "success";
  text: {
    creating: string;
    success: string;
    error: string;
  };
}) => (
  <MyTransition.ScaleAndOpacity show={status !== "idle"}>
    <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center rounded-md bg-white/70">
      <div className="flex items-center gap-sm">
        {status === "loading" ? (
          <>
            <MySpinner />
            <p className="font-mono">{text.creating}</p>
          </>
        ) : status === "success" ? (
          <>
            <span className="text-success">
              <TickIcon />
            </span>
            <p className="font-mono">{text.success}</p>
          </>
        ) : (
          <>
            <span className="text-2xl text-my-error-content">
              <ErrorIcon />
            </span>
            <p className="font-mono">{text.error}</p>
          </>
        )}
      </div>
    </div>
  </MyTransition.ScaleAndOpacity>
);
