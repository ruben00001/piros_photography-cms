import { type ImageTag } from "@prisma/client";

import { api } from "~/utils/api";
import { WithTooltip } from "~/components/ui-display";
import { RemoveIcon } from "~/components/ui-elements";
import { useStringArrStateContext as useTagsIdContext } from "~/context/StringArrState";
import InputSelect from "./input-select";

// const addTag = z.function().args(z.object({ newId: z.string() }));

const Tags = () => {
  const { strings: addedTagIds, addString: addTag } = useTagsIdContext();

  const { data: addedTags } = api.imageTag.getByIds.useQuery({
    ids: addedTagIds,
  });

  if (!addedTags) {
    return null;
  }

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
          {!addedTags.length ? "None yet. " : null}
          Tags can be used to search for images in the future.
        </p>
      </div>
      {addedTags.length ? (
        <div className="mt-xxxs flex items-center gap-sm">
          {addedTags.map((tag) => (
            <Tag tag={tag} key={tag.id} />
          ))}
        </div>
      ) : null}
      <div>
        <TagsInputSelect
          addTagToImage={(tagId) => addTag(tagId)}
          addedTags={addedTags}
        />
      </div>
    </div>
  );
};

export default Tags;

const Tag = ({ tag }: { tag: ImageTag }) => {
  const { removeString: removeTag } = useTagsIdContext();

  return (
    <div className="group relative rounded-md border border-base-200 transition-colors duration-75 ease-in-out hover:border-base-300">
      <div className="py-1 px-2 transition-colors duration-75 ease-in-out group-hover:bg-base-200">
        <p className="text-sm text-gray-600 transition-colors duration-75 ease-in-out group-hover:text-gray-800">
          {tag.text}
        </p>
        <WithTooltip text="remove tag" type="action">
          <span
            className="absolute top-0 right-0 z-10 origin-bottom-left -translate-y-3 translate-x-3 cursor-pointer rounded-full bg-white p-1 text-xs text-gray-400 opacity-0 transition-all duration-75 ease-in-out hover:scale-110 hover:bg-warning hover:text-warning-content group-hover:opacity-100"
            onClick={() => removeTag(tag.id)}
          >
            <RemoveIcon />
          </span>
        </WithTooltip>
      </div>
    </div>
  );
};

const TagsInputSelect = ({
  addTagToImage,
  addedTags,
}: {
  addedTags: ImageTag[];
  addTagToImage: (tagId: string) => void;
}) => {
  return (
    <InputSelect parent={{ addTagTo: addTagToImage, imageTags: addedTags }} />
  );
};
