import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { PériodeListPage } from './PériodeList.page';
import { PériodeListItemProps } from './PériodeListItem';

type SearchParams = 'page' | 'appelOffre' | 'statut';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Périodes',
  description: 'Périodes',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre ?? undefined;

      const estNotifiée =
        searchParams?.statut === undefined ? undefined : searchParams.statut === 'notifiee';

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

      const périodesPartiellementNotifiées: Période.ConsulterPériodeReadModel[] =
        estNotifiée === false ? await getPériodesPartiellementNotifiées(appelOffre) : [];

      const props = await mapToProps({
        utilisateur,
        périodes: périodesPartiellementNotifiées
          .concat(périodes.items)
          .filter(
            (val, i, self) =>
              self.findIndex((x) => x.identifiantPériode === val.identifiantPériode) === i,
          ),
      });

      return (
        <PériodeListPage
          filters={filters}
          périodes={props}
          range={périodes.range}
          total={périodes.total + périodesPartiellementNotifiées.length}
        />
      );
    }),
  );
}

const mapToProps = async ({
  périodes,
  utilisateur,
}: {
  périodes: Période.ListerPériodeItemReadModel[];
  utilisateur: Utilisateur.ValueType;
}): Promise<ReadonlyArray<PériodeListItemProps>> => {
  return await Promise.all(
    périodes.map(async (période) => {
      const stats = await getCandidaturesStatsForPeriode(
        période.identifiantPériode.appelOffre,
        période.identifiantPériode.période,
        période.estNotifiée,
      );

      const props: PériodeListItemProps = {
        appelOffre: période.identifiantPériode.appelOffre,
        période: période.identifiantPériode.période,
        identifiantPériode: période.identifiantPériode.formatter(),
        peutÊtreNotifiée:
          utilisateur.role.aLaPermission('période.notifier') &&
          (période.estNotifiée ? !!stats.restants?.total : !!stats.tous.total),
        notifiéLe: période.estNotifiée ? période.notifiéeLe?.formatter() : undefined,
        notifiéPar: période.estNotifiée ? période.notifiéePar?.formatter() : undefined,
        stats,
      };

      return props;
    }),
  );
};

const getCandidaturesStatsForPeriode = async (
  appelOffre: string,
  periode: string,
  estNotifiée: boolean,
) => {
  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre,
      période: periode,
    },
  });
  const restants = {
    éliminés: candidatures.items.filter((c) => !c.estNotifiée && c.statut.estÉliminé()).length,
    lauréats: candidatures.items.filter((c) => !c.estNotifiée && c.statut.estClassé()).length,
    total: candidatures.items.filter((c) => !c.estNotifiée).length,
  };
  return {
    tous: {
      éliminés: candidatures.items.filter((c) => c.statut.estÉliminé()).length,
      lauréats: candidatures.items.filter((c) => c.statut.estClassé()).length,
      total: candidatures.items.length,
    },
    restants: estNotifiée && restants.total ? restants : undefined,
  };
};

async function getPériodesPartiellementNotifiées(appelOffre: string | undefined) {
  const candidats = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      estNotifiée: false,
      appelOffre,
    },
  });
  const identifiantsPériodes = candidats.items
    .map(({ identifiantProjet }) => `${identifiantProjet.appelOffre}#${identifiantProjet.période}`)
    .filter((val, i, self) => self.indexOf(val) === i);

  const nouvellesPériodes = await Promise.all(
    identifiantsPériodes.map((identifiantPériodeValue) =>
      mediator.send<Période.ConsulterPériodeQuery>({
        type: 'Période.Query.ConsulterPériode',
        data: {
          identifiantPériodeValue,
        },
      }),
    ),
  );

  return nouvellesPériodes.filter(Option.isSome);
}
