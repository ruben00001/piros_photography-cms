import { type ReactElement } from "react";
import { useMeasure } from "react-use";

const ContainerDimension = ({
  children,
}: {
  children: ({
    height,
    width,
  }: {
    width: number;
    height: number;
  }) => ReactElement;
}) => {
  const [ref, { height, width }] = useMeasure<HTMLDivElement>();

  return (
    <div className="h-full" ref={ref}>
      {!width || !height ? null : children({ height, width })}
    </div>
  );
};

export default ContainerDimension;
