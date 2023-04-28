import { type NextPage } from "next";

import Layout from "~/components/layouts";
import PageContent from "~/home/Entry";

const HomePage: NextPage = () => (
  <Layout.Site>
    <Layout.Admin>
      <PageContent />
    </Layout.Admin>
  </Layout.Site>
);

export default HomePage;
