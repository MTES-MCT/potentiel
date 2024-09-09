import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { PériodeListPage, PériodeListPageProps } from '@/components/pages/période/PériodeList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type SearchParams = 'appelOffre' | 'statut';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Périodes',
  description: 'Périodes',
};

export default async function Page({ searchParams }: PageProps) {
  const appelOffre = searchParams?.appelOffre ?? undefined;

  const estNotifiée =
    searchParams?.statut === undefined ? undefined : searchParams.statut === 'notifiee';

  return PageWithErrorHandling(async () => {
    const périodes = await mediator.send<Période.ListerPériodesQuery>({
      type: 'Période.Query.ListerPériodes',
      data: {
        appelOffre,
        estNotifiée,
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
        defaultValue: '',
        options: appelOffres.items.map((item) => ({
          label: item.id,
          value: item.id,
        })),
      },
      {
        label: `Statut`,
        searchParamKey: 'statut',
        defaultValue: '',
        options: [
          {
            label: 'Notifiée',
            value: 'notifiee',
          },
          {
            label: 'À notifiée',
            value: 'a-notifier',
          },
        ],
      },
    ];

    const props = await mapToProps(périodes);

    return (
      <PériodeListPage
        filters={filters}
        périodes={props}
        range={périodes.range}
        total={périodes.total}
      />
    );
  });
}

const mapToProps = async (
  readModel: Période.ListerPériodesReadModel,
): Promise<PériodeListPageProps['périodes']> => {
  return await Promise.all(
    readModel.items.map(async (période) => {
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

      return {
        appelOffre: période.identifiantPériode.appelOffre,
        période: période.identifiantPériode.période,
        identifiantPériode: période.identifiantPériode.formatter(),
        peutÊtreNotifiée: période.estNotifiée ? false : true,
        notifiéeLe: période.estNotifiée ? période.notifiéeLe.formatter() : undefined,
        notifiéPar: période.estNotifiée ? période.notifiéePar.formatter() : undefined,
        totalÉliminés,
        totalLauréats,
        totalCandidatures,
      };
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

  console.info(`get stats for ${appelOffre} on ${periode} : ${JSON.stringify(stats)}`);

  return stats;
};
