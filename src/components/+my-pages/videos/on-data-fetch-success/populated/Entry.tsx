import AddVideo from "./AddVideo";
import Videos from "./Videos";

const Populated = () => {
  return (
    <div className="">
      <div className="max-w-[400px]">
        <AddVideo />
      </div>
      <div className="mt-md">
        <Videos />
      </div>
    </div>
  );
};

export default Populated;
