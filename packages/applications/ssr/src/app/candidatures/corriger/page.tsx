import { CorrigerCandidaturesPage } from '@/components/pages/candidature/corriger/CorrigerCandidatures.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => <CorrigerCandidaturesPage />);
}
