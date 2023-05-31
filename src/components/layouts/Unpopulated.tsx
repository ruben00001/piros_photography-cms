import { type ReactElement } from "react";

export const Unpopulated = ({
  icon,
  subTitle,
  title,
}: {
  icon: ReactElement;
  title: string;
  subTitle: string;
}) => (
  <div className="grid place-items-center">
    <div className="mb-xs text-4xl text-gray-300">{icon}</div>
    <h5 className="font-bold">{title}</h5>
    <p className="mt-xs mb-sm text-gray-500">{subTitle}</p>
  </div>
);
