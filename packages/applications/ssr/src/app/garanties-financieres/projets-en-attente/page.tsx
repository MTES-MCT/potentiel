import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from '@/components/pages/garanties-financières/en-attente/lister/ListerProjetsAvecGarantiesFinancièresEnAttente.page';
import { getGarantiesFinancièresMotifLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresMotifLabel';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import { ListFilterItem } from '@/components/molecules/ListFilters';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  appelOffre: z.string().optional(),
  cycle: z.enum(['CRE4', 'PPE2']).optional(),
  motif: z.string().optional(),
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
      const { page, appelOffre, cycle, motif } = searchParamsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const projetsAvecGarantiesFinancièresEnAttente =
        await mediator.send<GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
            data: {
              utilisateur: {
                régionDreal,
                identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
                rôle: utilisateur.role.nom,
              },
              appelOffre,
              motif,
              cycle,
              range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
            },
          },
        );

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: { cycle },
      });

      const filters: ListFilterItem<SearchParams>[] = [
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
          `${Routes.GarantiesFinancières.enAttente.lister}?${newSearchParams}`,
          RedirectType.replace,
        );
      }

      return (
        <ListProjetsAvecGarantiesFinancièresEnAttentePage
          list={mapToListProps(projetsAvecGarantiesFinancièresEnAttente, utilisateur.role)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = (
  {
    items,
    range,
    total,
  }: GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  role: Role.ValueType,
): ListProjetsAvecGarantiesFinancièresEnAttenteProps['list'] => {
  const mappedItems = items.map(
    ({ identifiantProjet, nomProjet, motif, dernièreMiseÀJour, dateLimiteSoumission }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      motif: getGarantiesFinancièresMotifLabel(motif.motif),
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      dateLimiteSoumission: dateLimiteSoumission.formatter(),
      afficherModèleMiseEnDemeure:
        dateLimiteSoumission.estAntérieurÀ(DateTime.now()) && role.estÉgaleÀ(Role.dreal),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
