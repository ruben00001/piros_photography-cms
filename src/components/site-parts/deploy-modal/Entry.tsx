/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { api } from "~/utils/api";
import { MyModal, WithTooltip } from "~/components/ui-display";
import { DeployIcon, MySpinner, UploadIcon } from "~/components/ui-elements";
import useIsAdmin from "~/hooks/useIsAdmin";
import LatestDeploy from "./LatestDeploy";

const DeployModal = () => (
  <MyModal.DefaultButtonAndPanel
    button={<ModalButton />}
    panelContent={<Panel />}
  />
);

export default DeployModal;

const ModalButton = () => {
  const { openModal } = MyModal.useProvider();

  return (
    <WithTooltip text="update site">
      <div
        className="cursor-pointer text-xl text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
        onClick={openModal}
      >
        <DeployIcon />
      </div>
    </WithTooltip>
  );
};

const Panel = () => (
  <div className="relative w-[600px] max-w-[90vw] rounded-2xl bg-white p-6 text-left shadow-xl">
    <h3 className="border-b border-b-base-300 pb-sm leading-6 text-base-content">
      Upload changes
    </h3>
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        When you&apos;re ready to upload any changes you&apos;ve made, press the
        upload button below.
      </p>
      <p className="mt-1 text-sm text-gray-400">
        The process usually takes 2-5 minutes.
      </p>
    </div>
    <div className="mt-8">
      <UploadButton />
    </div>
    <LatestDeploy />
  </div>
);

const UploadButton = () => {
  const latestDeployQuery = api.vercel.getLatestDeploy.useQuery(undefined, {
    enabled: false,
  });

  const deployMutation = api.vercel.deploy.useMutation({
    onSettled() {
      void latestDeployQuery.refetch();
    },
  });

  const isAdmin = useIsAdmin();

  return (
    <div>
      <div
        className={`relative inline-flex items-center gap-3 rounded-sm border border-blue-500 bg-blue-100 py-1 px-3 text-blue-500 transition-colors duration-75 ease-in-out hover:bg-blue-200 ${
          !isAdmin ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!isAdmin) {
            return;
          }

          deployMutation.mutate();
        }}
      >
        <span>
          <UploadIcon />
        </span>
        <span className="font-sans text-sm">upload changes</span>
        {deployMutation.isLoading ? (
          <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center gap-3 rounded-sm bg-gray-50/70 pl-2">
            <span>
              <MySpinner size={16} />
            </span>
            <span className="font-mono text-xs text-gray-400">
              Connecting...
            </span>
          </div>
        ) : null}
      </div>
      {deployMutation.error ? (
        <p className="mt-1 text-sm lowercase text-my-error-content">
          {deployMutation.error.message}
        </p>
      ) : null}
    </div>
  );
};
