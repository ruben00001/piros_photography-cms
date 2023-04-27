import { useSession } from "next-auth/react";

import DeployModal from "../deploy-modal/Entry";
import { SideBarMenu } from "./SideBarMenu";

const Header = () => (
  <div className="flex items-center justify-between border-b bg-gray-50 px-md py-sm">
    <SideBarMenu />
    <div className="flex items-center gap-12">
      <Status />
      <DeployModal />
    </div>
  </div>
);

export default Header;

const Status = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <div className="text-sm tracking-wide text-blue-400">
      <span>{data.user.role.slice(0, 1)}</span>
      <span className="lowercase">
        {data.user.role.slice(1, data.user.role.length)}
      </span>
    </div>
  );
};
