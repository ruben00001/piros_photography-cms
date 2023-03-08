import { AlertIcon, ErrorIcon, SuccessIcon } from "../Icon";

const Toast = ({
  text,
  type,
}: {
  text: string;
  type: "error" | "success" | "alert";
}) => {
  return (
    <div
      className="flex w-full max-w-xs items-center text-gray-500"
      role="alert"
    >
      <div
        className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
          type === "alert"
            ? "bg-my-alert text-my-alert-content"
            : type === "error"
            ? "bg-my-error text-my-error-content"
            : "bg-my-success text-my-success-content"
        }`}
      >
        {type === "error" ? (
          <ErrorIcon />
        ) : type === "success" ? (
          <SuccessIcon />
        ) : (
          <AlertIcon />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{text}</div>
    </div>
  );
};

export default Toast;
