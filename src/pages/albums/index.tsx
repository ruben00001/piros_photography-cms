import AlbumsPageContent from "~/components/+my-pages/albums/index";
import Layout from "~/components/layouts";

export default function AlbumsPage() {
  return (
    <Layout.Site title={{ pageName: "Albums" }}>
      <Layout.Admin>
        <AlbumsPageContent />
      </Layout.Admin>
    </Layout.Site>
  );
}
