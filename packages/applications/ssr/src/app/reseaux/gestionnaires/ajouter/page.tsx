import { AjouterGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/AjouterGestionnaireRéseauPage';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    return <AjouterGestionnaireRéseauPage />;
  });
}
