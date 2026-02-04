import { Metadata } from 'next';
import { mediator } from 'mediateur';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Accès } from '@potentiel-domain/projet';

import { ListFilterItem } from '@/components/molecules/ListFilters';

import { PageWithErrorHandling } from '../../utils/PageWithErrorHandling';
import { withUtilisateur } from '../../utils/withUtilisateur';
import { mapToRangeOptions } from '../../utils/pagination';
import { optionalStringArray } from '../_helpers/optionalStringArray';

import { RéclamerProjetsListItemProps } from './RéclamerProjetsListItem';
import { RéclamerProjetsListPage } from './RéclamerProjetList.page';
import { chiffrerIdentifiantProjet, generateIV } from './_helpers/chiffrement';

const searchParamsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  periode: z.string().optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Réclamer un ou plusieurs projets - Potentiel',
  description: 'Liste des projets à réclamer',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Accès.RéclamerAccèsProjetUseCase>(
        'Projet.Accès.UseCase.RéclamerAccèsProjet',
      );

      const {
        page,
        appelOffre,
        nomProjet,
        periode: période,
      } = searchParamsSchema.parse(searchParams);

      const projetsÀRéclamer = await mediator.send<Accès.ListerProjetsÀRéclamerQuery>({
        type: 'Projet.Accès.Query.ListerProjetsÀRéclamer',
        data: {
          appelOffre,
          période,
          nomProjet,
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

      const périodesOption =
        appelOffres.items
          .find((ao) => appelOffre?.includes(ao.id))
          ?.periodes.map((p) => ({
            label: p.title,
            value: p.id,
          })) ?? [];

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          multiple: true,
          affects: ['periode'],
        },
        {
          label: `Période`,
          searchParamKey: 'periode',
          options: périodesOption,
        },
      ];

      const iv = generateIV();

      return (
        <RéclamerProjetsListPage
          filters={filters}
          projets={mapToProps(
            projetsÀRéclamer.items,
            utilisateur.identifiantUtilisateur.formatter(),
            iv,
          )}
          range={projetsÀRéclamer.range}
          total={projetsÀRéclamer.total}
        />
      );
    }),
  );
}

const mapToProps = (
  projets: Accès.ListerProjetsÀRéclamerReadModel['items'],
  emailUtilisateur: string,
  iv: string,
): Array<RéclamerProjetsListItemProps> =>
  projets.map((projet) => {
    const identifiantProjetChiffré = chiffrerIdentifiantProjet(
      projet.identifiantProjet.formatter(),
      iv,
    );
    return {
      identifiantProjet: identifiantProjetChiffré,
      appelOffre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      famille: projet.identifiantProjet.famille,
      nomProjet: projet.nomProjet,
      userHasSameEmail: projet.emailContact === emailUtilisateur,
      puissance: projet.puissance,
      région: projet.région,
      iv,
    };
  });
