import { type ReactElement } from "react";
import { useMeasure } from "react-use";

const ContainerDimension = ({
  children,
  ignoreHeight,
}: {
  children: ({
    height,
    width,
  }: {
    width: number;
    height: number;
  }) => ReactElement;
  ignoreHeight?: boolean;
}) => {
  const [ref, { height, width }] = useMeasure<HTMLDivElement>();

  return (
    <div className="h-full flex-grow" ref={ref}>
      {!width || (!ignoreHeight && !height)
        ? null
        : children({ height, width })}
    </div>
  );
};

export default ContainerDimension;
