import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { Période } from '@potentiel-domain/periode';
import type { Candidature } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ImporterCandidaturesPage } from './ImporterCandidatures.page';

const paramsSchema = z.object({
  estUnReimport: z.stringbool().optional(),
});

type PageProps = {
  searchParams?: Promise<Record<string, string>>;
};

export const metadata: Metadata = { title: 'Importer des candidats' };

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Candidature.ImporterCandidatureUseCase>(
        'Candidature.UseCase.ImporterCandidature',
      );

      const { estUnReimport } = paramsSchema.parse(searchParams);

      const périodes = await mediator.send<Période.ListerPériodesQuery>({
        type: 'Période.Query.ListerPériodes',
        data: {
          estNotifiée: !!estUnReimport,
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
