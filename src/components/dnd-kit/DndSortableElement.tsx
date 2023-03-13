import { type ReactElement } from "react";
import {
  useSortable,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import WithTooltip from "../data-display/WithTooltip";
import { GrabHandleIcon } from "../Icon";

const DndSortableElement = ({
  isDisabled = false,
  children,
  elementId,
  wrapperClasses,
}: {
  children: ReactElement;
  elementId: string;
  isDisabled?: boolean;
  wrapperClasses?: string;
}): ReactElement => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: elementId,
    disabled: isDisabled,
    strategy: rectSortingStrategy,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <>
      <div
        className={`group/dndElement relative transition-opacity duration-100 ease-in-out ${
          isDragging ? "z-50 opacity-40" : ""
        } ${wrapperClasses}`}
        style={style}
        ref={setNodeRef}
      >
        {children}
        <div className="absolute top-1/2 right-0 z-30 translate-x-full -translate-y-1/2 rounded-sm py-1 opacity-0 hover:opacity-100 group-hover/dndElement:opacity-100">
          <WithTooltip text="drag to change position" isDisabled={isDragging}>
            <button
              className="text-2xl"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
              }}
              type="button"
              {...attributes}
              {...listeners}
              ref={setActivatorNodeRef}
            >
              <GrabHandleIcon />
            </button>
          </WithTooltip>
        </div>
      </div>
      {isDragging ? <div className="fixed inset-0 z-40 "></div> : null}
    </>
  );
};

export default DndSortableElement;
