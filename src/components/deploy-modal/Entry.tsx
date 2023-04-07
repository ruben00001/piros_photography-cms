import { api } from "~/utils/api";
import { DeployIcon, InfoIcon, UploadIcon } from "../Icon";
import WithTooltip from "../data-display/WithTooltip";
import { Modal, useModalVisibilityContext } from "../modal";

const DeployModal = () => {
  return <Modal button={<Button />} panelContent={<Panel />} />;
};

export default DeployModal;

const Button = () => {
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
  return (
    <div className="inline-flex cursor-pointer items-center gap-3 rounded-sm border border-blue-500 bg-blue-100 py-1 px-3 text-blue-500 transition-colors duration-75 ease-in-out hover:bg-blue-200">
      <span>
        <UploadIcon />
      </span>
      <span className="font-sans text-sm">upload changes</span>
    </div>
  );
};

const LatestDeployInfo = () => {
  const { data, refetch: fetchLatestDeploy } =
    api.vercel.getLatestDeploy.useQuery(undefined, {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  console.log("data:", data);

  return (
    <div className="mt-8">
      <h5 className="flex items-center gap-2">
        <span className="text-lg text-blue-600">
          <InfoIcon />
        </span>
        <span className="text-sm text-gray-600">Last update info</span>
        <button onClick={void fetchLatestDeploy()}>Fetch</button>
      </h5>
      {/* <div>{JSON.stringify(latestData)}</div> */}
    </div>
  );
};
