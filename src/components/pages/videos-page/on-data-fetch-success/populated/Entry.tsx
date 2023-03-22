import AddVideo from "./AddVideo";
import Videos from "./Videos";

const Populated = () => {
  return (
    <div className="p-lg">
      <div className="max-w-[400px]">
        <AddVideo />
      </div>
      <div>
        <Videos />
      </div>
    </div>
  );
};

export default Populated;
