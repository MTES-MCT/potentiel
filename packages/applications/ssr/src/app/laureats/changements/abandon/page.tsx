import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { match } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalStringArray';

import { AbandonListPage, AbandonListPageProps } from './AbandonList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Abandons - Potentiel',
  description: 'Liste des abandons de projet',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  recandidature: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: transformToOptionalEnumArray(z.enum(Lauréat.Abandon.StatutAbandon.statuts)),
  preuveRecandidatureStatut: z.enum(Lauréat.Abandon.StatutPreuveRecandidature.statuts).optional(),
  autorite: z.enum(Lauréat.Abandon.AutoritéCompétente.autoritésCompétentes).optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const {
        page,
        recandidature,
        nomProjet,
        appelOffre,
        statut,
        preuveRecandidatureStatut,
        autorite,
      } = paramsSchema.parse(searchParams);

      const abandons = await mediator.send<Lauréat.Abandon.ListerDemandesAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ListerDemandesAbandon',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          recandidature: recandidature,
          statut: statut?.length
            ? statut.map((s) => Lauréat.Abandon.StatutAbandon.convertirEnValueType(s).statut)
            : undefined,
          appelOffre: appelOffre,
          preuveRecandidatureStatut,
          nomProjet,
          autoritéCompétente: autorite,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut',
          multiple: true,
          searchParamKey: 'statut',
          options: Lauréat.Abandon.StatutAbandon.statuts
            .filter((s) => s !== 'inconnu' && s !== 'annulé')
            .sort((a, b) => a.localeCompare(b))
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
        },

        {
          label: 'Recandidature',
          searchParamKey: 'recandidature',
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
          affects: ['preuveRecandidatureStatut'],
        },
        {
          label: 'Preuve de recandidature',
          searchParamKey: 'preuveRecandidatureStatut',
          options: Lauréat.Abandon.StatutPreuveRecandidature.statuts
            .filter((s) => s !== 'non-applicable')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
        {
          label: 'Autorité compétente',
          searchParamKey: 'autorite',
          options: Lauréat.Abandon.AutoritéCompétente.autoritésCompétentes.map((autorité) => ({
            label: match(autorité)
              .with('dreal', () => 'DREAL')
              .with('dgec', () => 'DGEC')
              .exhaustive(),
            value: autorité,
          })),
        },
      ];

      return <AbandonListPage list={mapToListProps(abandons)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  readModel: Lauréat.Abandon.ListerDemandesAbandonReadModel,
): AbandonListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      statut: { statut },
      miseÀJourLe,
      recandidature,
      preuveRecandidatureStatut: { statut: preuveRecandidatureStatut },
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      statut,
      miseÀJourLe: miseÀJourLe.formatter(),
      recandidature,
      preuveRecandidatureStatut,
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
