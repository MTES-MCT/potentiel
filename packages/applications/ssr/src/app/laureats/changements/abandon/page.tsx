import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { getContext } from '@potentiel-applications/request-context';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { getAutoritéCompétenteLabel, transformToOptionalEnumArray } from '@/app/_helpers';
import { optionalStringArray } from '@/app/_helpers';

import { AbandonListPage, AbandonListPageProps } from './AbandonList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = { title: "Demandes d'abandon" };

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  recandidature: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  statut: transformToOptionalEnumArray(z.enum(Lauréat.Abandon.StatutAbandon.statuts)),
  preuveRecandidatureStatut: z.enum(Lauréat.Abandon.StatutPreuveRecandidature.statuts).optional(),
  autorite: z.enum(Lauréat.Abandon.AutoritéCompétente.autoritésCompétentes).optional(),
  PPA: z.stringbool().optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
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
        PPA,
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
          estPartiEnPPA: PPA,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const { features } = getContext() ?? {};

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut',
          multiple: true,
          searchParamKey: 'statut',
          options: Lauréat.Abandon.StatutAbandon.statuts
            .filter((s) => s !== 'inconnu')
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
          multiple: true,
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
            label: getAutoritéCompétenteLabel(autorité),
            value: autorité,
          })),
        },
      ];

      if (features?.includes('PPA')) {
        filters.push({
          label: 'PPA',
          searchParamKey: 'PPA',
          options: [
            { label: 'Oui', value: 'true' },
            { label: 'Non', value: 'false' },
          ],
        });
      }

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
      dateDemande,
      estPartiEnPPA,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      statut,
      miseÀJourLe: miseÀJourLe.formatter(),
      recandidature,
      preuveRecandidatureStatut,
      dateDemande: dateDemande.formatter(),
      estPartiEnPPA,
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
