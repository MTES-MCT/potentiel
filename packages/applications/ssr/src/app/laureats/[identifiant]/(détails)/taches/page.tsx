import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';

import { mapToPlainObject } from '@potentiel-domain/core';
import { TâcheListPage } from '../../../../taches/TâcheList.page';
import z from 'zod';
import { getTâches } from './_helpers/getTâches';
import { mapToRangeOptions } from '@/utils/pagination';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
});

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      checkFeatureFlag(identifiantProjet, searchParams);

      const { page } = searchParamsSchema.parse(searchParams);

      const tâches = await getTâches({
        identifiantProjet,
        email: utilisateur.identifiantUtilisateur.email,
        range: mapToRangeOptions({
          currentPage: page,
        }),
      });

      return <TâcheListPage list={mapToPlainObject(tâches)} filters={[]} />;
    }),
  );
}
