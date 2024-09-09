import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PériodeListPage, PériodeListPageProps } from '@/components/pages/période/PériodeList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type SearchParams = 'appelOffre' | 'statut';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Périodes - Notifier',
  description: 'Notifier une période',
};

export default async function Page({ searchParams }: PageProps) {
  const appelOffre = searchParams?.appelOffre ?? undefined;

  const estNotifiée =
    searchParams?.statut === undefined ? undefined : searchParams.statut === 'true';

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

    return (
      <PériodeListPage
        filters={filters}
        périodes={mapToProps(périodes)}
        range={périodes.range}
        total={périodes.total}
      />
    );
  });
}

const mapToProps = (readModel: Période.ListerPériodesReadModel): PériodeListPageProps['périodes'] =>
  readModel.items.map((période) => ({
    appelOffre: période.identifiantPériode.appelOffre,
    période: période.identifiantPériode.période,
    identifiantPériode: période.identifiantPériode.formatter(),
    peutÊtreNotifiée: période.estNotifiée ? false : true,
    notifiéeLe: période.estNotifiée ? période.notifiéeLe.formatter() : undefined,
    notifiéPar: période.estNotifiée ? période.notifiéePar.formatter() : undefined,
    totalÉliminés: période.estNotifiée ? période.identifiantÉliminés.length : undefined,
    totalLauréats: période.estNotifiée ? période.identifiantLauréats.length : undefined,
    totalCandidatures: période.estNotifiée ? période.identifiantLauréats.length : undefined,
  }));
