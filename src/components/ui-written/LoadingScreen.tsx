import { MySpinner } from "../ui-elements";

export const LoadingScreen = ({
  text,
  showSpinner = false,
}: {
  text: string;
  showSpinner?: boolean;
}) => (
  <div className="my-screen-center">
    <div className="flex flex-col items-center gap-md">
      {showSpinner ? <MySpinner /> : <div />}
      <p className="font-mono">{text}</p>
    </div>
  </div>
);
