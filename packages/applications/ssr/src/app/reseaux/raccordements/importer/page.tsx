import { ImporterDatesMiseEnServicePage } from '@/components/pages/réseau/raccordement/importer/importerDatesMiseEnService/ImporterDatesMiseEnServicePage';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    return <ImporterDatesMiseEnServicePage />;
  });
}
