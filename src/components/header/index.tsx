import { SideBarMenu } from "./SideBarMenu";

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b bg-gray-50 px-md py-sm">
      <SideBarMenu />
    </div>
  );
};

export default Header;
