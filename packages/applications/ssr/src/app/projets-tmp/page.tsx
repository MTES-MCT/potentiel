import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ProjetsListPage } from '@/components/pages/candidature/ProjetsList.page';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      if (process.env.APPLICATION_STAGE !== 'local') {
        return notFound();
      }

      const identifiantProjet = searchParams?.identifiantProjet;
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;

      const data = await mediator.send<Candidature.ListerProjetsQuery>({
        type: 'Candidature.Query.ListerProjets',
        data: {
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
          role: utilisateur.role.nom,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          query: identifiantProjet,
        },
      });

      const props = mapToPlainObject(data);

      return <ProjetsListPage items={props.items} total={props.total} range={props.range} />;
    }),
  );
}
