import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { getGarantiesFinancièresMotifLabel } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/getGarantiesFinancièresMotifLabel';
import { getStatutLauréatLabel } from '@/app/_helpers/getStatutLauréatLabel';

import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from './ListerProjetsAvecGarantiesFinancièresEnAttente.page';
import { ListItemProjetAvecGarantiesFinancièresEnAttenteActions } from './ListItemProjetAvecGarantiesFinancièresEnAttente';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  appelOffre: z.string().optional(),
  cycle: z.enum(['CRE4', 'PPE2']).optional(),
  motif: z.string().optional(),
  statut: z.enum(Lauréat.StatutLauréat.statuts).optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Projets en attente de garanties financières - Potentiel',
  description: 'Liste des projets pour lesquels de nouvelles garanties financières sont attendues',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, cycle, motif, statut } = searchParamsSchema.parse(searchParams);

      const projetsAvecGarantiesFinancièresEnAttente =
        await mediator.send<Lauréat.GarantiesFinancières.ListerGarantiesFinancièresEnAttenteQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            appelOffre,
            motif,
            cycle,
            statut,
            range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
          },
        });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: { cycle },
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut du projet',
          searchParamKey: 'statut',
          options: Lauréat.StatutLauréat.statuts.map((value) => ({
            label: getStatutLauréatLabel(value),
            value,
          })),
        },
        {
          label: "Cycle d'appels d'offres",
          searchParamKey: 'cycle',
          options: [
            { label: 'PPE2', value: 'PPE2' },
            { label: 'CRE4', value: 'CRE4' },
          ],
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
        {
          label: 'Motif',
          searchParamKey: 'motif',
          options: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.motifs.map(
            (motif) => ({
              label: getGarantiesFinancièresMotifLabel(motif),
              value: motif,
            }),
          ),
        },
      ];

      // on retire le searchParam "appelOffre" si l'AO ne fait pas partie du cycle passé en searchParam
      if (appelOffre && cycle && !appelOffres.items.find((ao) => ao.id === appelOffre)) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('appelOffre');
        redirect(
          `${Routes.GarantiesFinancières.enAttente.lister()}?${newSearchParams}`,
          RedirectType.replace,
        );
      }

      return (
        <ListProjetsAvecGarantiesFinancièresEnAttentePage
          list={mapToListProps({
            list: projetsAvecGarantiesFinancièresEnAttente,
            role: utilisateur.rôle,
          })}
          filters={filters}
        />
      );
    }),
  );
}

type MapToListProps = {
  list: Lauréat.GarantiesFinancières.ListerGarantiesFinancièresEnAttenteReadModel;
  role: Role.ValueType;
};

const mapToListProps = ({
  list: { items, total, range },
  role,
}: MapToListProps): ListProjetsAvecGarantiesFinancièresEnAttenteProps['list'] => {
  return {
    items: items.map((item) =>
      mapToPlainObject({
        ...item,
        actions: mapToActions({ item, role }),
      }),
    ),
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};

type MapToActions = (props: {
  item: Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteListItemReadModel;
  role: Role.ValueType;
}) => ListItemProjetAvecGarantiesFinancièresEnAttenteActions;

const mapToActions: MapToActions = ({ item, role }) =>
  item.dateLimiteSoumission.estAntérieurÀ(DateTime.now()) && role.estDreal()
    ? ['mise-en-demeure']
    : [];
