import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { PériodeListPage } from '@/components/pages/période/PériodeList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { PériodeListItemProps } from '@/components/pages/période/PériodeListItem';
import { mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

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

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((item) => ({
            label: item.id,
            value: item.id,
          })),
        },
        {
          label: `Statut`,
          searchParamKey: 'statut',
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
      const { totalLauréats, totalÉliminés, totalCandidatures, totalNonNotifiés } =
        await getCandidaturesStatsForPeriode(
          période.identifiantPériode.appelOffre,
          période.identifiantPériode.période,
        );

      const props: PériodeListItemProps = {
        appelOffre: période.identifiantPériode.appelOffre,
        période: période.identifiantPériode.période,
        identifiantPériode: période.identifiantPériode.formatter(),
        peutÊtreNotifiée: période.estNotifiée
          ? totalNonNotifiés > 0
          : utilisateur.role.aLaPermission('période.notifier'),
        notifiéLe: période.estNotifiée ? période.notifiéeLe?.formatter() : undefined,
        notifiéPar: période.estNotifiée ? période.notifiéePar?.formatter() : undefined,
        totalLauréats,
        totalÉliminés,
        totalCandidatures,
        nouveauxCandidatsANotifier: période.estNotifiée ? totalNonNotifiés : 0,
      };

      return props;
    }),
  );
};

const getCandidaturesStatsForPeriode = async (appelOffre: string, periode: string) => {
  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre,
      période: periode,
    },
  });

  return {
    totalÉliminés: candidatures.items.filter((current) => current.statut.estÉliminé()).length,
    totalLauréats: candidatures.items.filter((current) => current.statut.estClassé()).length,
    totalCandidatures: candidatures.items.length,
    totalNonNotifiés: candidatures.items.filter((current) => !current.estNotifiée).length,
  };
};
