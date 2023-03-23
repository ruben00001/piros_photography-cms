import { type NextPage } from "next";
import {
  AdminAuthenticatedLayout,
  SiteLayout,
  ContentBodyLayout,
} from "~/components/layout";

const Home: NextPage = () => {
  return (
    <SiteLayout>
      <AdminAuthenticatedLayout>
        <ContentBodyLayout>
          <div>Home page</div>
        </ContentBodyLayout>
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default Home;
