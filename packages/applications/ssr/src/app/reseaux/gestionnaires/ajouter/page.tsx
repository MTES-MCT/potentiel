import { AjouterGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/ajouter/AjouterGestionnaireRéseau.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    return <AjouterGestionnaireRéseauPage />;
  });
}
