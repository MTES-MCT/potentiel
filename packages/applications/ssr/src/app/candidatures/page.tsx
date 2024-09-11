import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Candidature } from '@potentiel-domain/candidature';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { StatutCandidature } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Période } from '@potentiel-domain/periode';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToRangeOptions } from '@/utils/pagination';
import { CandidatureListPage } from '@/components/pages/candidature/lister/CandidatureList.page';
import { CandidatureListItemProps } from '@/components/pages/candidature/lister/CandidatureListItem';
import { ListFilterItem } from '@/components/molecules/ListFilters';

type SearchParams = 'page' | 'appelOffre' | 'periode' | 'statut' | 'nomProjet';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Candidatures - Potentiel',
  description: 'Liste des candidatures',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const appelOffre = searchParams?.appelOffre;
    const périodeParams = searchParams?.periode;
    const nomProjet = searchParams?.nomProjet;
    const statut = searchParams?.statut;
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;

    const candidaturesData = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        range: mapToRangeOptions({
          currentPage: page,
          itemsPerPage: 10,
        }),
        nomProjet,
        appelOffre,
        période: périodeParams,
        statut: statut ? StatutCandidature.convertirEnValueType(statut).statut : undefined,
      },
    });

    const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
      type: 'AppelOffre.Query.ListerAppelOffre',
      data: {},
    });

    const périodesOption =
      appelOffres.items
        .find((appelOffresItem) => appelOffresItem.id === appelOffre)
        ?.periodes.map((p) => ({
          label: p.title,
          value: p.id,
        })) ?? [];

    const filters: ListFilterItem<SearchParams>[] = [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        defaultValue: appelOffre,
        options: appelOffres.items.map((appelOffre) => ({
          label: appelOffre.id,
          value: appelOffre.id,
        })),
      },
      {
        label: `Période`,
        searchParamKey: 'periode',
        defaultValue: périodeParams,
        options: périodesOption,
      },
      {
        label: 'Statut',
        searchParamKey: 'statut',
        defaultValue: statut,
        options: [
          {
            label: 'Classé',
            value: StatutCandidature.classé.statut,
          },
          {
            label: 'Éliminé',
            value: StatutCandidature.éliminé.statut,
          },
        ],
      },
    ];

    if (candidaturesData.items.length === 0) {
      return (
        <CandidatureListPage
          items={[]}
          range={candidaturesData.range}
          total={candidaturesData.total}
          filters={filters}
        />
      );
    }

    const items: Array<CandidatureListItemProps> = [];

    const identifiantsPériode = périodeParams
      ? [`${appelOffre}#${périodeParams}`]
      : Array.from(
          new Set(
            candidaturesData.items.map(
              (candidature) =>
                `${candidature.identifiantProjet.appelOffre}#${candidature.identifiantProjet.période}`,
            ),
          ),
        );

    for (const identifiantPériode of identifiantsPériode) {
      const période = await mediator.send<Période.ConsulterPériodeQuery>({
        type: 'Période.Query.ConsulterPériode',
        data: {
          identifiantPériodeValue: identifiantPériode,
        },
      });

      console.log('viovio', période);

      if (Option.isSome(période)) {
        console.log('viovio', période.estNotifiée);
      }
    }

    for (const candidature of candidaturesData.items) {
      const appelOffresItem = appelOffres.items.find(
        (appelOffresItem) => appelOffresItem.id === candidature.identifiantProjet.appelOffre,
      );

      if (!appelOffresItem) {
        getLogger().warn(`Aucun appel d'offres trouvé pour la candidature`, {
          identifiantProjet: candidature.identifiantProjet.formatter(),
          appelOffre: candidature.identifiantProjet.appelOffre,
        });
      }

      items.push(
        mapToPlainObject({
          ...candidature,
          unitePuissance: appelOffresItem?.unitePuissance ?? 'MWc',
        }),
      );
    }

    for (const candidature of candidaturesData.items) {
      const appelOffresItem = appelOffres.items.find(
        (appelOffresItem) => appelOffresItem.id === candidature.identifiantProjet.appelOffre,
      );

      if (!appelOffresItem) {
        getLogger().warn(`Aucun appel d'offres trouvé pour la candidature`, {
          identifiantProjet: candidature.identifiantProjet.formatter(),
          appelOffre: candidature.identifiantProjet.appelOffre,
        });
      }

      items.push(
        mapToPlainObject({
          ...candidature,
          unitePuissance: appelOffresItem?.unitePuissance ?? 'MWc',
        }),
      );
    }

    return (
      <CandidatureListPage
        range={candidaturesData.range}
        total={candidaturesData.total}
        items={items}
        filters={filters}
      />
    );
  });
}
