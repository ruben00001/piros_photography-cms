import AlbumsPageContent from "~/components/+my-pages/albums/+Entry";
import Layout from "~/components/layouts";

const AlbumsPage = () => (
  <Layout.Site title={{ pageName: "Albums" }}>
    <Layout.Admin>
      <AlbumsPageContent />
    </Layout.Admin>
  </Layout.Site>
);

export default AlbumsPage;
