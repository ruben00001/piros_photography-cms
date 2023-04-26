import { MySpinner } from "../ui-elements";

export const LoadingScreen = ({
  text,
  showSpinner = false,
}: {
  text: string;
  showSpinner?: boolean;
}) => {
  return (
    <div className="my-screen-center bg-gray-50">
      <div className="rounded-md bg-white/80 p-lg ">
        <div className="flex flex-col items-center gap-md">
          {showSpinner ? <MySpinner /> : null}
          <p className="font-mono">{text}</p>
        </div>
      </div>
    </div>
  );
};
