import { type ImageTag } from "@prisma/client";

import WithTooltip from "~/components/data-display/WithTooltip";
import { RemoveIcon } from "~/components/Icon";

const Tags = ({
  tags,
}: // removeKeyword,
{
  tags: ImageTag[];
  // removeKeyword: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-sm border-t pt-xs">
      <div>
        <p className="inline-block text-sm text-base-content">
          Add and remove tags.
        </p>
        <p className="text-sm text-gray-400">
          {!tags.length ? "None yet. " : null}
          Tags can be used to search for images in the future.
        </p>
      </div>
      <div className="flex items-center gap-xs">
        {tags.length
          ? tags.map((tag) => (
              <Tag
                tag={tag}
                // removeKeyword={() => removeKeyword(keyword.id)}
                key={tag.id}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Tags;

const Tag = ({
  tag,
}: {
  tag: ImageTag;
  // removeKeyword: () => void;
}) => {
  // const [containerIsHovered, hoverHandlers] = useHovered();

  return (
    <div
      // className="group"
      className="relative rounded-md border py-0.5 px-1"
    >
      <p className="text-sm text-gray-600 group-hover:text-gray-800">
        {tag.text}
      </p>
      {/*       <WithWarning
        warningText={{ heading: "Delete keyword from image?" }}
        callbackToConfirm={removeKeyword}
        type="moderate"
      > */}
      <WithTooltip text="delete keyword from image" type="action">
        <span className="absolute top-0 right-0 z-10 -translate-y-1 translate-x-1 cursor-pointer text-xs transition-all duration-75 ease-in-out hover:scale-110 hover:text-warning-content">
          <RemoveIcon />
        </span>
      </WithTooltip>
      {/* </WithWarning> */}
    </div>
  );
};
