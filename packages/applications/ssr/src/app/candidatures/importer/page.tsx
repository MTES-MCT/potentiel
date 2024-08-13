import { ImporterCandidaturesPage } from '@/components/pages/candidature/importer/ImporterCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => <ImporterCandidaturesPage />);
}
