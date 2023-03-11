import { type ReactElement } from "react";
import {
  useSortable,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useHovered from "~/hooks/useHovered";
import WithTooltip from "../data-display/WithTooltip";
import { GrabHandleIcon } from "../Icon";

const DndSortableElement = ({
  isDisabled = false,
  children,
  elementId,
  colSpan,
  handlePos = "in",
}: {
  children: ReactElement;
  elementId: string;
  isDisabled?: boolean;
  colSpan?: number;
  handlePos?: "in" | "out";
}): ReactElement => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: elementId,
    disabled: isDisabled,
    animateLayoutChanges,
  });
  const [grabHandleIsHovered, handlehoverHandlers] = useHovered();
  const [containerIsHovered, containerHoverHandlers] = useHovered();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handlePosStyle =
    handlePos === "out" ? `right-0 translate-x-full` : `right-1`;

  return (
    <div
      /*       css={[
        tw`relative z-20`,
        colSpan && s_container(colSpan),
        (grabHandleIsHovered || isDragging) && tw`opacity-70`,
        tw`transition-opacity ease-in-out duration-75 hover:z-40`,
      ]} */
      className="relative z-20"
      style={style}
      ref={setNodeRef}
      {...containerHoverHandlers}
    >
      {children}
      <div
        className="absolute top-1/2 right-0 z-30 translate-x-full -translate-y-1/2 rounded-sm py-1"
        /*         css={[
          tw`absolute top-1/2 z-30 -translate-y-1/2 rounded-sm py-1`,
          handlePosStyle,
          grabHandleIsHovered && tw`bg-white`,
          s_transition.toggleVisiblity(containerIsHovered),
        ]} */
      >
        <WithTooltip text="drag to change position" isDisabled={isDragging}>
          <button
            className="text-2xl"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            type="button"
            {...attributes}
            {...listeners}
            {...handlehoverHandlers}
          >
            <GrabHandleIcon />
          </button>
        </WithTooltip>
      </div>
    </div>
  );
};

export default DndSortableElement;
