/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { api, type RouterOutputs } from "~/utils/api";
import { timeAgo } from "~/helpers/time-ago";
import {
  DeployIcon,
  InfoIcon,
  RefreshIcon,
  SpinnerIcon,
  UploadIcon,
} from "../Icon";
import Spinner from "../Spinner";
import WithTooltip from "../data-display/WithTooltip";
import { Modal, useModalVisibilityContext } from "../modal";

const DeployModal = () => {
  return <Modal button={<ModalButton />} panelContent={<Panel />} />;
};

export default DeployModal;

const ModalButton = () => {
  const { open } = useModalVisibilityContext();

  return (
    <WithTooltip text="update site">
      <div
        className="cursor-pointer text-lg text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
        onClick={open}
      >
        <DeployIcon />
      </div>
    </WithTooltip>
  );
};

const Panel = () => {
  return (
    <div className="relative w-[600px] max-w-[90vw] rounded-2xl bg-white p-6 text-left shadow-xl">
      <h3 className="border-b border-b-base-300 pb-sm leading-6 text-base-content">
        Upload changes
      </h3>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          When you&apos;re ready to upload any changes you&apos;ve made, press
          the upload button below.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          The process usually takes 2-5 minutes.
        </p>
      </div>
      <div className="mt-8">
        <UploadButton />
      </div>
      <LatestDeployInfo />
    </div>
  );
};

const UploadButton = () => {
  const latestDeployQuery = api.vercel.getLatestDeploy.useQuery(undefined, {
    enabled: false,
  });

  const deployMutation = api.vercel.deploy.useMutation({
    onSettled() {
      void latestDeployQuery.refetch();
    },
  });

  return (
    <div
      className="relative inline-flex cursor-pointer items-center gap-3 rounded-sm border border-blue-500 bg-blue-100 py-1 px-3 text-blue-500 transition-colors duration-75 ease-in-out hover:bg-blue-200"
      onClick={() => deployMutation.mutate()}
    >
      <span>
        <UploadIcon />
      </span>
      <span className="font-sans text-sm">upload changes</span>
      {deployMutation.isLoading ? (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center gap-3 rounded-sm bg-gray-50/70 pl-2">
          <span>
            <Spinner size={16} />
          </span>
          <span className="font-mono text-xs text-gray-400">Connecting...</span>
        </div>
      ) : null}
    </div>
  );
};

const LatestDeployInfo = () => {
  const latestDeployQuery = api.vercel.getLatestDeploy.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mt-8">
      <div className="flex items-end gap-6">
        <div className="flex items-center gap-4">
          <h5 className="flex items-center gap-2">
            <span className="text-lg text-blue-600">
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
