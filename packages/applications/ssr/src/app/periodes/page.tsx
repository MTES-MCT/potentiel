import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { PériodeListPage, PériodeListPageProps } from '@/components/pages/période/PériodeList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { PériodeListItemProps } from '@/components/pages/période/PériodeListItem';
import { mapToRangeOptions } from '@/utils/pagination';

type SearchParams = 'page' | 'appelOffre' | 'statut';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Périodes',
  description: 'Périodes',
};

export default async function Page({ searchParams }: PageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const appelOffre = searchParams?.appelOffre ?? undefined;

  const estNotifiée =
    searchParams?.statut === undefined ? undefined : searchParams.statut === 'notifiee';

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const périodes = await mediator.send<Période.ListerPériodesQuery>({
        type: 'Période.Query.ListerPériodes',
        data: {
          appelOffre,
          estNotifiée,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: PériodeListPageProps['filters'] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          defaultValue: undefined,
          options: appelOffres.items.map((item) => ({
            label: item.id,
            value: item.id,
          })),
        },
        {
          label: `Statut`,
          searchParamKey: 'statut',
          defaultValue: 'a-notifier',
          options: [
            {
              label: 'Notifiée',
              value: 'notifiee',
            },
            {
              label: 'À notifier',
              value: 'a-notifier',
            },
          ],
        },
      ];

      const props = await mapToProps({ utilisateur, périodes });

      return (
        <PériodeListPage
          filters={filters}
          périodes={props}
          range={périodes.range}
          total={périodes.total}
        />
      );
    }),
  );
}

const mapToProps = async ({
  périodes,
  utilisateur,
}: {
  périodes: Période.ListerPériodesReadModel;
  utilisateur: Utilisateur.ValueType;
}): Promise<ReadonlyArray<PériodeListItemProps>> => {
  return await Promise.all(
    périodes.items.map(async (période) => {
      const { totalÉliminés, totalLauréats, totalCandidatures } = période.estNotifiée
        ? {
            totalÉliminés: période.identifiantÉliminés.length,
            totalLauréats: période.identifiantLauréats.length,
            totalCandidatures:
              période.identifiantÉliminés.length + période.identifiantLauréats.length,
          }
        : await getCandidaturesStatsForPeriode(
            période.identifiantPériode.appelOffre,
            période.identifiantPériode.période,
          );

      const props: PériodeListItemProps = {
        appelOffre: période.identifiantPériode.appelOffre,
        période: période.identifiantPériode.période,
        identifiantPériode: période.identifiantPériode.formatter(),
        peutÊtreNotifiée: période.estNotifiée
          ? false
          : utilisateur.role.aLaPermission('période.notifier'),
        notifiéLe: période.estNotifiée ? période.notifiéeLe.formatter() : undefined,
        notifiéPar: période.estNotifiée ? période.notifiéePar.formatter() : undefined,
        totalÉliminés,
        totalLauréats,
        totalCandidatures,
      };

      return props;
    }),
  );
};

const getCandidaturesStatsForPeriode = async (
  appelOffre: string,
  periode: string,
): Promise<{
  totalÉliminés: number;
  totalLauréats: number;
  totalCandidatures: number;
}> => {
  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre,
      période: periode,
    },
  });

  const stats = {
    totalÉliminés: candidatures.items.filter((current) => current.statut.estÉliminé()).length ?? 0,
    totalLauréats: candidatures.items.filter((current) => current.statut.estClassé()).length ?? 0,
    totalCandidatures: candidatures.items.length,
  };

  return stats;
};
