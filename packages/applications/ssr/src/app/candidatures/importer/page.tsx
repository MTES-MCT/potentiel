import { z } from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Période } from '@potentiel-domain/periode';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ImporterCandidaturesPage } from './ImporterCandidatures.page';

const paramsSchema = z.object({
  reimport: z.string().optional(),
});

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<Candidature.ImporterCandidatureUseCase>(
        'Candidature.UseCase.ImporterCandidature',
      );

      const { reimport } = paramsSchema.parse(searchParams);
      const périodes = await mediator.send<Période.ListerPériodesQuery>({
        type: 'Période.Query.ListerPériodes',
        data: {
          estNotifiée: reimport ? true : false,
        },
      });

      return PageWithErrorHandling(async () => (
        <ImporterCandidaturesPage
          périodes={mapToPlainObject(
            périodes.items.toSorted((a, b) =>
              a.identifiantPériode.formatter().localeCompare(b.identifiantPériode.formatter()),
            ),
          )}
          importMultipleAOEtPeriodesPossible={process.env.APPLICATION_STAGE !== 'production'}
        />
      ));
    }),
  );
}
