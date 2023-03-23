import AuthenticatedLayout from "~/components/layout/Authenticated";
import OnDataFetchSuccess from "./on-data-fetch-success";
import PageDataFetchInit from "./PageDataFetchInit";

const AlbumsPage = () => {
  return (
    <AuthenticatedLayout>
      <PageDataFetchInit>
        <OnDataFetchSuccess />
      </PageDataFetchInit>
    </AuthenticatedLayout>
  );
};

export default AlbumsPage;
