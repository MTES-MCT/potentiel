import { z } from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Période } from '@potentiel-domain/periode';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ImporterCandidaturesPage } from './ImporterCandidatures.page';

const paramsSchema = z.object({
  estUnReimport: z.stringbool().optional(),
});

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Candidature.ImporterCandidatureUseCase>(
        'Candidature.UseCase.ImporterCandidature',
      );

      const { estUnReimport } = paramsSchema.parse(searchParams);

      const périodes = await mediator.send<Période.ListerPériodesQuery>({
        type: 'Période.Query.ListerPériodes',
        data: {
          estNotifiée: estUnReimport ? true : false,
        },
      });

      return PageWithErrorHandling(async () => (
        <ImporterCandidaturesPage
          périodes={mapToPlainObject(
            périodes.items.toSorted((a, b) =>
              getPériodeLabelForSorting(a.identifiantPériode).localeCompare(
                getPériodeLabelForSorting(b.identifiantPériode),
              ),
            ),
          )}
          importMultipleAOEtPeriodesPossible={process.env.APPLICATION_STAGE !== 'production'}
          estUnReimport={!!estUnReimport}
        />
      ));
    }),
  );
}

const getPériodeLabelForSorting = (identifiantPériode: Période.IdentifiantPériode.ValueType) =>
  `${identifiantPériode.appelOffre}#${identifiantPériode.période.padStart(2)}`;
