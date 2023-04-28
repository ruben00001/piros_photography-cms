import AlbumsPageContent from "~/components/+my-pages/albums/index";
import Layout from "~/components/layouts";

// TODO: Create test album + video, etc and make suer guest can't delete, modify, etc.

export default function AlbumsPage() {
  return (
    <Layout.Site title={{ pageName: "Albums" }}>
      <Layout.Admin>
        <AlbumsPageContent />
      </Layout.Admin>
    </Layout.Site>
  );
}
