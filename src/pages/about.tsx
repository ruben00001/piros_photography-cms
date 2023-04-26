import Layout from "~/components/layouts";
import PageContent from "~/about-page/Entry";

const AboutPage = () => {
  return (
    <Layout.Site>
      <Layout.Admin>
        <PageContent />
      </Layout.Admin>
    </Layout.Site>
  );
};

export default AboutPage;
