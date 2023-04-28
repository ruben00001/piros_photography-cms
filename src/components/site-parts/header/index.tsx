import { signOut, useSession } from "next-auth/react";

import { MyMenu, WithTooltip } from "~/components/ui-display";
import { SignOutIcon } from "~/components/ui-elements";
import DeployModal from "../deploy-modal/Entry";
import { SideBarMenu } from "./SideBarMenu";

const Header = () => (
  <div className="flex items-center justify-between border-b bg-gray-50 px-md py-sm">
    <SideBarMenu />
    <div className="flex items-center gap-12">
      <StatusMenu />
      <DeployModal />
    </div>
  </div>
);

export default Header;

const StatusMenu = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <div className="relative">
      <MyMenu
        button={<StatusButton />}
        styles={{ itemsWrapper: "absolute -bottom-1 right-0 translate-y-full" }}
      >
        <StatusMenuContent />
      </MyMenu>
    </div>
  );
};

const StatusButton = () => {
  const { data } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const role = data!.user.role;

  return (
    <WithTooltip text="user menu">
      <div className="cursor-pointer text-sm tracking-wide text-blue-400">
        <span>{role.slice(0, 1)}</span>
        <span className="lowercase">{role.slice(1, role.length)}</span>
      </div>
    </WithTooltip>
  );
};

const StatusMenuContent = () => {
  const { data } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const role = data!.user.role;

  return (
    <div className="bg-white p-6">
      <h3>{role === "GUEST" ? "Guest" : "Admin"}</h3>
      <div className="mt-6 ml-[20px] flex flex-col gap-4">
        <div
          className="flex cursor-pointer items-center gap-7 rounded-lg py-1 px-4 hover:bg-gray-100"
          onClick={() => void signOut()}
        >
          <div className="text-2xl text-gray-400">
            <SignOutIcon />
          </div>
          <div className="whitespace-nowrap text-sm font-light text-gray-500">
            Sign out
          </div>
        </div>
      </div>
    </div>
  );
};
