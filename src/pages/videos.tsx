import PageContent from "~/components/+my-pages/videos/Entry";
import Layout from "~/components/layouts";

const VideosPage = () => {
  return (
    <Layout.Site title={{ pageName: "Videos" }}>
      <Layout.Admin>
        <PageContent />
      </Layout.Admin>
    </Layout.Site>
  );
};

export default VideosPage;
