/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { api } from "~/utils/api";
import Layout from "~/components/layouts";
import AddVideo from "./AddVideo";
import Populated from "./populated/Entry";
import Unpopulated from "./unpopulated/Entry";

const OnDataFetchSuccess = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  return (
    <Layout.ContentBody>
      <div className="p-lg">
        <h1 className="text-xl text-gray-400">Videos Page</h1>
        <p className="mt-xxs text-sm text-gray-300">
          The layout below is for editing purposes and isn&apos;t necessarily
          meant as a visual representation of the page that visitors will see.
        </p>
        <div className="mt-lg">
          <AddVideo />
        </div>
        <div className="mt-lg">
          {!data!.length ? <Unpopulated /> : <Populated />}
        </div>
      </div>
    </Layout.ContentBody>
  );
};

export default OnDataFetchSuccess;
