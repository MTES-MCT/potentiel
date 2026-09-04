import Notice from '@codegouvfr/react-dsfr/Notice';
import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import z from 'zod';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { Accès } from '@potentiel-domain/projet';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { ListFilterItem } from '@/components/molecules/ListFilters';
import { PageWithErrorHandling } from '../../utils/PageWithErrorHandling';
import { mapToRangeOptions } from '../../utils/pagination';
import { withUtilisateur } from '../../utils/withUtilisateur';
import { optionalStringArray } from '../_helpers/optionalStringArray';
import { chiffrerIdentifiantProjet, generateIV } from './_helpers/chiffrement';
import { RéclamerProjetsListPage } from './RéclamerProjetList.page';
import type { RéclamerProjetsListItemProps } from './RéclamerProjetsListItem';

const searchParamsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  periode: z.string().optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

type PageProps = {
  searchParams?: Promise<Partial<Record<SearchParams, string>>>;
};

export const metadata: Metadata = {
  title: 'Projets à réclamer',
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
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
          complement={
            <Notice
              className="pb-0"
              title="Un projet est absent de la liste ?"
              description={
                <div className="flex flex-col gap-1">
                  <span>
                    Cette page liste les projets non rattachés à un utilisateur Potentiel.
                  </span>
                  <span>
                    Après la désignation d’une période, une invitation à gérer votre projet est
                    envoyée à l’adresse e-mail de candidature. Il peut-être donc déjà rattaché à un
                    autre utilisateur Potentiel.{' '}
                    <Link
                      href="https://docs.potentiel.beta.gouv.fr/guide-dutilisation/pages-daide/en-tant-que-porteur-de-projet/designation-des-projets-sur-potentiel"
                      target="_blank"
                    >
                      Consultez notre guide d’utilisation pour en savoir plus.
                    </Link>
                  </span>
                </div>
              }
            />
          }
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
