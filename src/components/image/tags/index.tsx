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
    <div className="flex flex-col gap-sm border-t border-t-base-200 pt-sm">
      <div>
        <div className="flex gap-sm">
          <p className="inline-block text-sm text-base-content">
            Add and remove tags.
          </p>
          <span className="text-sm italic text-gray-400">Optional</span>
        </div>
        <p className="mt-xxs text-sm text-gray-400">
          {!tags.length ? "None yet. " : null}
          Tags can be used to search for images in the future.
        </p>
      </div>
      <div className="mt-xxxs flex items-center gap-sm">
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
    <div className="group relative rounded-md border border-base-200 transition-colors duration-75 ease-in-out hover:border-base-300">
      <div className="py-0.5 px-1 transition-colors duration-75 ease-in-out group-hover:bg-base-200">
        <p className="text-sm text-gray-600 transition-colors duration-75 ease-in-out group-hover:text-gray-800">
          {tag.text}
        </p>
        {/*       <WithWarning
        warningText={{ heading: "Delete keyword from image?" }}
        callbackToConfirm={removeKeyword}
        type="moderate"
      > */}
        <WithTooltip text="delete tag from image" type="action">
          <span className="absolute top-0 right-0 z-10 -translate-y-1.5 translate-x-1.5 cursor-pointer text-xs text-gray-400 opacity-0 transition-all duration-75 ease-in-out hover:scale-110 hover:text-warning group-hover:opacity-100">
            <RemoveIcon />
          </span>
        </WithTooltip>
        {/* </WithWarning> */}
      </div>
    </div>
  );
};
