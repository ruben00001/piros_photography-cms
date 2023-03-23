import { type ReactElement } from "react";

export const ContentBodyLayout = ({
  children,
  maxWidth = 1000,
}: {
  children: ReactElement;
  maxWidth?: number;
}) => {
  return (
    <div className="flex justify-center">
      <div className={`w-full`} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
};
