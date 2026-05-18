import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerLesGestionnairesParUtilisateur } from '../_helpers/récupérerLesGestionnairesParUtilisateur';
import { ImporterDatesMiseEnServicePage } from './ImporterDatesMiseEnService.page';

export const metadata: Metadata = { title: 'Importer des dates de mise en service' };

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
