import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ImporterDatesMiseEnServicePage } from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/ImporterDatesMiseEnService.page';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { récupérerLesGestionnairesParUtilisateur } from '../_helpers/récupérerLesGestionnairesParUtilisateur';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>(
        'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      );
      const listeGestionnaireRéseau = await récupérerLesGestionnairesParUtilisateur(utilisateur);

      return (
        <ImporterDatesMiseEnServicePage
          gestionnaireRéseauActuel={mapToPlainObject(listeGestionnaireRéseau[0])}
          listeGestionnairesRéseau={mapToPlainObject(listeGestionnaireRéseau)}
        />
      );
    }),
  );
}
