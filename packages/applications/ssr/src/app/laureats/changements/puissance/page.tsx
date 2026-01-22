import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { transformToOptionalEnumArray } from '@/app/_helpers';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { optionalStringArray } from '@/app/_helpers';

import {
  ChangementPuissanceListPage,
  ChangementPuissanceListPageProps,
} from './ChangementPuissanceList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Liste des demandes de changement de puissance - Potentiel',
  description: 'Liste des demandes de changement de puissance',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  statut: transformToOptionalEnumArray(z.enum(Lauréat.Puissance.StatutChangementPuissance.statuts)),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const changements = await mediator.send<Lauréat.Puissance.ListerChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ListerChangementPuissance',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          statut: statut?.length
            ? statut.map(
                (s) => Lauréat.Puissance.StatutChangementPuissance.convertirEnValueType(s).statut,
              )
            : undefined,
          appelOffre,
          nomProjet,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut',
          searchParamKey: 'statut',
          multiple: true,
          options: Lauréat.Puissance.StatutChangementPuissance.statuts
            .toSorted((a, b) => a.localeCompare(b))
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          multiple: true,
        },
      ];

      return <ChangementPuissanceListPage list={mapToListProps(changements)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  changements: Lauréat.Puissance.ListerChangementPuissanceReadModel,
): ChangementPuissanceListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      statut: mapToPlainObject(item.statut),
      miseÀJourLe: mapToPlainObject(item.miseÀJourLe),
      demandéLe: mapToPlainObject(item.demandéLe),
      nouvellePuissance: item.nouvellePuissance,
      unitéPuissance: item.unitéPuissance,
    })),
    pagination,
    total: changements.total,
  };
};
