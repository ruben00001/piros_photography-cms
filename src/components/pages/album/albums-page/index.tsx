import PageContent from "./page-content";
import PageInit from "./PageInit";
import PageProviders from "./PageProviders";

const AlbumsPage = () => {
  return (
    <PageInit>
      <PageProviders>
        <PageContent />
      </PageProviders>
    </PageInit>
  );
};

export default AlbumsPage;
