import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { récupérerLesGestionnairesParUtilisateur } from '../_helpers/récupérerLesGestionnairesParUtilisateur';

import { ImporterDatesMiseEnServicePage } from './ImporterDatesMiseEnService.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>(
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
