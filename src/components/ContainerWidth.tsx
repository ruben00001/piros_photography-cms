import { type ReactElement } from "react";
import { useMeasure } from "react-use";

const ContainerWidth = ({
  children,
}: {
  children: (arg0: { width: number }) => ReactElement;
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return (
    <div className="w-full" ref={ref}>
      {!width ? null : children({ width })}
    </div>
  );
};

export default ContainerWidth;
