import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { AjouterGestionnaireRéseauPage } from './AjouterGestionnaireRéseau.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<GestionnaireRéseau.AjouterGestionnaireRéseauUseCase>(
        'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      );

      return <AjouterGestionnaireRéseauPage />;
    }),
  );
}
