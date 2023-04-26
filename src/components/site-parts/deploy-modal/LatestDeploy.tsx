/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { api, type RouterOutputs } from "~/utils/api";
import { WithTooltip } from "~/components/ui-display";
import { InfoIcon, RefreshIcon, SpinnerIcon } from "~/components/ui-elements";
import { timeAgo } from "~/helpers/time-ago";

const LatestDeploy = () => {
  const latestDeployQuery = api.vercel.getLatestDeploy.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mt-8">
      <div className="flex items-end gap-6">
        <div className="flex items-center gap-4">
          <h5 className="flex items-center gap-2">
            <span className="grid place-items-center text-lg text-blue-600">
              <InfoIcon />
            </span>
            <span className="text-sm text-gray-600">Last update</span>
          </h5>
          <WithTooltip text="update data">
            <button
              className={`text-xs text-gray-400 ${
                latestDeployQuery.isFetching
                  ? "cursor-auto opacity-40"
                  : "opacity-100"
              }`}
              onClick={() => {
                if (latestDeployQuery.isFetching) {
                  return;
                }
                void latestDeployQuery.refetch();
              }}
            >
              <RefreshIcon />
            </button>
          </WithTooltip>
        </div>
        <span
          className={`font-mono text-xs text-gray-400 transition-opacity duration-75 ease-in-out ${
            !latestDeployQuery.isInitialLoading && latestDeployQuery.isFetching
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          updating...
        </span>
      </div>
      <div className="mt-4">
        {latestDeployQuery.isInitialLoading ? (
          <div className="flex items-center gap-2 pl-6">
            <span className="font-mono text-xs text-gray-400">Loading</span>
            <span className="text-gray-400">
              <SpinnerIcon />
            </span>
          </div>
        ) : !latestDeployQuery.data ? (
          <div>Something went wrong...</div>
        ) : (
          <LatestDeployData data={latestDeployQuery.data} />
        )}
      </div>
    </div>
  );
};

export default LatestDeploy;

type Deploy = RouterOutputs["vercel"]["getLatestDeploy"];

const LatestDeployData = ({ data }: { data: NonNullable<Deploy> }) => {
  return (
    <div className="flex items-center gap-12">
      <div className="flex items-center gap-2">
        <span
          className={`aspect-square w-[8px] rounded-full ${
            data.readyState === "READY"
              ? "bg-my-success-content"
              : data.readyState === "ERROR"
              ? "bg-my-error-content"
              : data.readyState === "CANCELED"
              ? "bg-gray-400"
              : "bg-blue-500"
          }`}
        />
        <p className="text-sm font-medium capitalize text-gray-600">
          <span>{data.readyState.slice(0, 1)}</span>
          <span className="lowercase">
            {data.readyState.slice(1, data.readyState.length)}
          </span>
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">
          {timeAgo(new Date(data.createdAt))}
        </p>
      </div>
    </div>
  );
};
