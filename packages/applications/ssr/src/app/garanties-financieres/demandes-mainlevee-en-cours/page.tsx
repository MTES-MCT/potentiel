import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import {
  convertMotifMainlevéeForView,
  convertStatutMainlevéeForView,
} from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/_helpers';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalEnumArray';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import {
  ListeDemandeMainlevéePage,
  ListeDemandeMainlevéeProps,
} from './ListeDemandeMainlevée.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Demande de mainlevée des garanties financières - Potentiel',
  description: 'Liste des demandes de mainlevée des garanties financières',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  appelOffre: z.string().optional(),
  statut: transformToOptionalEnumArray(
    z.enum(Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statuts),
  ),
  motif: z
    .enum(Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.motifs)
    .optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, motif, statut } = paramsSchema.parse(searchParams);

      const demandeMainlevéeDesGarantiesFinancières =
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            appelOffre,

            motif: motif
              ? Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
                  motif,
                ).motif
              : undefined,
            statut: statut?.length
              ? statut.map(
                  (s) =>
                    Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
                      s,
                    ).statut,
                )
              : undefined,
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

      const motifMainlevée =
        Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.motifs;

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut de mainlevée',
          searchParamKey: 'statut',
          multiple: true,
          options: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statuts
            .toSorted((a, b) => a.localeCompare(b))
            .map((statut) => ({
              label: convertStatutMainlevéeForView(statut),
              value: statut,
            })),
        },
        {
          label: 'Motif de mainlevée',
          searchParamKey: 'motif',
          options: motifMainlevée.map((motif) => ({
            label: convertMotifMainlevéeForView(motif),
            value: motif,
          })),
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return (
        <ListeDemandeMainlevéePage
          list={mapToListProps(demandeMainlevéeDesGarantiesFinancières)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = ({
  items,
  range,
  total,
}: Lauréat.GarantiesFinancières.ListerMainlevéesReadModel): ListeDemandeMainlevéeProps['list'] => {
  const mappedItems = items.map(
    ({ appelOffre, demande, dernièreMiseÀJour, identifiantProjet, motif, nomProjet, statut }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      statut: statut.statut,
      demandéLe: demande.demandéeLe.formatter(),
      nomProjet,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      appelOffre,
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
