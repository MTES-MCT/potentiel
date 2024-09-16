import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Candidature } from '@potentiel-domain/candidature';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
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
    const appelOffreParams = searchParams?.appelOffre;
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
        appelOffre: appelOffreParams,
        période: périodeParams,
        statut: statut
          ? Candidature.StatutCandidature.convertirEnValueType(statut).statut
          : undefined,
      },
    });

    const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
      type: 'AppelOffre.Query.ListerAppelOffre',
      data: {},
    });

    const périodesOption =
      appelOffres.items
        .find((appelOffresItem) => appelOffresItem.id === appelOffreParams)
        ?.periodes.map((p) => ({
          label: p.title,
          value: p.id,
        })) ?? [];

    const filters: ListFilterItem<SearchParams>[] = [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        defaultValue: appelOffreParams,
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
            value: Candidature.StatutCandidature.classé.statut,
          },
          {
            label: 'Éliminé',
            value: Candidature.StatutCandidature.éliminé.statut,
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

    const périodesNotifiées = await récupérerPériodesNotifiées({
      appelOffreParams,
      périodeParams,
    });

    const items: Array<CandidatureListItemProps> = [];

    for (const candidature of candidaturesData.items) {
      const appelOffresItem = appelOffres.items.find(
        (appelOffresItem) => appelOffresItem.id === candidature.identifiantProjet.appelOffre,
      );

      if (!appelOffresItem) {
        getLogger().warn(`Aucun appel d'offres existant trouvé pour la candidature`, {
          identifiantProjet: candidature.identifiantProjet.formatter(),
          appelOffre: candidature.identifiantProjet.appelOffre,
        });
      }

      const estPériodeLegacy =
        appelOffresItem?.periodes.find((x) => x.id === candidature.identifiantProjet.période)
          ?.type === 'legacy';

      const estNotifiée = périodesNotifiées.includes(
        `${candidature.identifiantProjet.appelOffre}#${candidature.identifiantProjet.période}`,
      );

      const actions = estNotifiée
        ? 'télécharger-attestation'
        : !estPériodeLegacy
          ? 'prévisualiser-attestation'
          : undefined;

      items.push(
        mapToPlainObject({
          ...candidature,
          // ts forces us to do that
          actions: actions as 'télécharger-attestation' | undefined | 'prévisualiser-attestation',
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

const récupérerPériodesNotifiées = async ({
  appelOffreParams,
  périodeParams,
}: {
  appelOffreParams?: string;
  périodeParams?: string;
}): Promise<Période.IdentifiantPériode.RawType[]> => {
  const hasSetASpecificPériode = périodeParams && appelOffreParams;

  if (hasSetASpecificPériode) {
    const période = await mediator.send<Période.ConsulterPériodeQuery>({
      type: 'Période.Query.ConsulterPériode',
      data: {
        identifiantPériodeValue: `${appelOffreParams}#${périodeParams}`,
      },
    });
    if (Option.isNone(période)) {
      return [];
    }
  }
  const périodes = await mediator.send<Période.ListerPériodesQuery>({
    type: 'Période.Query.ListerPériodes',
    data: {
      appelOffre: appelOffreParams,
    },
  });

  return périodes.items
    .filter((période) => période.estNotifiée)
    .map((période) => période.identifiantPériode.formatter());
};
