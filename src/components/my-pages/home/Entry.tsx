import { UnderContstructionIcon } from "~/components/Icon";

const HomePage = () => {
  return (
    <div className="mt-xl grid place-items-center">
      <div className="mb-xs text-4xl text-gray-300">
        <UnderContstructionIcon weight="light" />
      </div>
      <h5 className="font-bold">Home page</h5>
      <p className="mt-xs mb-sm text-gray-500">Home page under construction</p>
    </div>
  );
};

export default HomePage;
