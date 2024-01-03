import { mediator } from 'mediateur';
import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { Abandon } from '@potentiel-domain/laureat';
import {
  AbandonListPage,
  AbandonListPageProps,
} from '@/components/pages/abandon/lister/AbandonListPage';
import { displayDate } from '@/utils/displayDate';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import type { Metadata } from 'next';
import { ConsulterRégionDrealQuery } from '@potentiel-domain/utilisateur';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Abandons - Potentiel',
  description: 'Liste des abandons de projet',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getUser();
    if (!utilisateur) {
      redirect('/login.html');
    }

    const page = searchParams?.page ? parseInt(searchParams.page) : 1;

    const recandidature =
      searchParams?.recandidature !== undefined ? searchParams.recandidature === 'true' : undefined;

    const statut = searchParams?.statut
      ? Abandon.StatutAbandon.convertirEnValueType(searchParams.statut).statut
      : undefined;

    const appelOffre = searchParams?.appelOffre;

    const getRégion = async (email: string) => {
      return await mediator.send<ConsulterRégionDrealQuery>({
        type: 'CONSULTER_RÉGION_DREAL_QUERY',
        data: { identifiantUtilisateur: email },
      });
    };

    const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        utilisateur: {
          email: utilisateur.email,
          rôle: utilisateur.rôle,
        },
        pagination: { page, itemsPerPage: 10 },
        recandidature,
        statut,
        appelOffre,
        ...(utilisateur.rôle === 'dreal' && {
          région: (await getRégion(utilisateur.email)).région,
        }),
      },
    });

    const appelOffres = await mediator.send<ListerAppelOffreQuery>({
      type: 'LISTER_APPEL_OFFRE_QUERY',
      data: {},
    });

    const filters = [
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
        label: 'Recandidature',
        searchParamKey: 'recandidature',
        defaultValue: searchParams?.recandidature,
        options: [
          {
            label: 'Avec recandidature',
            value: 'true',
          },
          {
            label: 'Sans recandidature',
            value: 'false',
          },
        ],
      },
      {
        label: 'Statut',
        searchParamKey: 'statut',
        defaultValue: statut,
        options: Abandon.StatutAbandon.statuts
          .filter((s) => s !== 'inconnu' && s !== 'annulé')
          .map((statut) => ({
            label: statut.replace('-', ' ').toLocaleLowerCase(),
            value: statut,
          })),
      },
    ];

    return <AbandonListPage list={mapToListProps(abandons)} filters={filters} />;
  });
}

const mapToListProps = (
  readModel: Abandon.ListerAbandonReadModel,
): AbandonListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      appelOffre,
      période,
      famille,
      nomProjet,
      statut: { statut },
      misÀJourLe,
      recandidature,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      famille,
      statut,
      misÀJourLe: displayDate(misÀJourLe.date),
      recandidature,
    }),
  );

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
