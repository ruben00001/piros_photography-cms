import { type ImageTag } from "@prisma/client";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { RemoveIcon } from "~/components/Icon";
import Toast from "~/components/data-display/Toast";
import WithTooltip from "~/components/data-display/WithTooltip";
import { useImageContext } from "../../../_context";
import InputSelect from "./input-select";

const Tags = () => {
  const image = useImageContext();

  return (
    <div className="flex flex-col gap-sm">
      <div className="border-b border-b-base-300 pb-sm">
        <h3 className="leading-6 text-base-content">Edit tags</h3>
        <p className="mt-xs text-sm text-gray-400">
          Tags can be used to search for images in the future.
        </p>
      </div>
      <div>
        <p className="mt-xxs text-sm text-gray-500">
          {!image.tags.length ? "None yet. " : "Current tags"}
        </p>
      </div>
      {image.tags.length ? (
        <div className="mt-xxxs flex items-center gap-sm">
          {image.tags.map((tag) => (
            <Tag tag={tag} key={tag.id} />
          ))}
        </div>
      ) : null}
      <InputSelect />
    </div>
  );
};

export default Tags;

const Tag = ({ tag }: { tag: ImageTag }) => {
  const image = useImageContext();

  const { refetch: refetchImages } = api.image.imagesPageGetAll.useQuery(
    undefined,
    { enabled: false },
  );
  const { refetch: refetchImageTags } = api.imageTag.getAll.useQuery(
    undefined,
    { enabled: false },
  );

  const removeTagMutation = api.image.removeTag.useMutation({
    onSuccess: async () => {
      await refetchImages();
      await refetchImageTags();

      toast(<Toast text="Tag removed" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Something went wrong remvoing tag" type="error" />);
    },
  });
  return (
    <div className="group relative rounded-md border border-base-200 transition-colors duration-75 ease-in-out hover:border-base-300">
      <div className="py-1 px-2 transition-colors duration-75 ease-in-out group-hover:bg-base-200">
        <p className="text-sm text-gray-600 transition-colors duration-75 ease-in-out group-hover:text-gray-800">
          {tag.text}
        </p>
        <WithTooltip text="remove tag" type="action">
          <span
            className="absolute top-0 right-0 z-10 origin-bottom-left -translate-y-3 translate-x-3 cursor-pointer rounded-full bg-white p-1 text-xs text-gray-400 opacity-0 transition-all duration-75 ease-in-out hover:scale-110 hover:bg-warning hover:text-warning-content group-hover:opacity-100"
            onClick={() =>
              removeTagMutation.mutate({
                data: { tagId: tag.id },
                where: { imageId: image.id },
              })
            }
          >
            <RemoveIcon />
          </span>
        </WithTooltip>
      </div>
    </div>
  );
};
