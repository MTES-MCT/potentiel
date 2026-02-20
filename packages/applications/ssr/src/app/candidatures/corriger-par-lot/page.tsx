import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Période } from '@potentiel-domain/periode';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { CorrigerCandidaturesParLotPage } from './CorrigerCandidaturesParLot.page';

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Candidature.CorrigerCandidatureUseCase>(
        'Candidature.UseCase.CorrigerCandidature',
      );

      const périodes = await mediator.send<Période.ListerPériodesQuery>({
        type: 'Période.Query.ListerPériodes',
        data: {},
      });
      return (
        <CorrigerCandidaturesParLotPage
          périodes={mapToPlainObject(
            périodes.items.toSorted((a, b) =>
              getPériodeLabelForSorting(a.identifiantPériode).localeCompare(
                getPériodeLabelForSorting(b.identifiantPériode),
              ),
            ),
          )}
        />
      );
    }),
  );
}
const getPériodeLabelForSorting = (identifiantPériode: Période.IdentifiantPériode.ValueType) =>
  `${identifiantPériode.appelOffre}#${identifiantPériode.période.padStart(2)}`;
