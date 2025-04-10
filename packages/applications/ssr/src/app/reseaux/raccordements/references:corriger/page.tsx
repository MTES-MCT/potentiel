import { CorrigerRéférencesDossierPage } from '@/components/pages/réseau/raccordement/corriger-par-lot/CorrigerRéférencesDossier.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => <CorrigerRéférencesDossierPage />);
}
