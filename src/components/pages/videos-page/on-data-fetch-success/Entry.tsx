/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Populated from "./populated";
import Unpopulated from "./unpopulated";

const OnDataFetchSuccess = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  return data!.length ? <Populated /> : <Unpopulated />;
};

export default OnDataFetchSuccess;
