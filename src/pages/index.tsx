import { type NextPage } from "next";

import {
  AdminAuthenticatedLayout,
  ContentBodyLayout,
  SiteLayout,
} from "~/components/layout";
import PageContent from "~/home/Entry";

const HomePage: NextPage = () => {
  return (
    <SiteLayout>
      <AdminAuthenticatedLayout>
        <ContentBodyLayout>
          <PageContent />
        </ContentBodyLayout>
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default HomePage;
