import { getUser } from '@/utils/getUtilisateur';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { AjouterGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/AjouterGestionnaireRéseauPage';
import { OperationRejectedError } from '@potentiel-domain/core';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getUser();

    if (utilisateur?.rôle === 'admin') {
      return <AjouterGestionnaireRéseauPage />;
    }

    throw new OperationRejectedError('Utilisateur non connecté');
  });
}
