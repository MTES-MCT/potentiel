import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { AjouterGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/ajouter/AjouterGestionnaireRéseauPage';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    return <AjouterGestionnaireRéseauPage />;
  });
}
