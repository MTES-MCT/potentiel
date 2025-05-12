import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { z } from 'zod';

import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
  Role,
  Région,
} from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import {
  UtilisateurListPage,
  UtilisateurListPageProps,
} from '@/components/pages/utilisateur/lister/UtilisateurList.page';
import { listeDesRoles } from '@/utils/utilisateur/format-role';
import { ListFilterItem } from '@/components/molecules/ListFilters';

export const metadata: Metadata = {
  title: 'Utilisateurs - Potentiel',
  description: 'Liste des utilisateurs ayant accès à Potentiel',
};

type PageProps = {
  searchParams?: Record<string, string>;
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  role: z.string().optional(),
  identifiantUtilisateur: z.string().optional(),
  identifiantGestionnaireReseau: z.string().optional(),
  region: z.string().optional(),
  zni: z
    .enum(['true', 'false'])
    .optional()
    .transform((zni) => (zni === 'true' ? true : zni === 'false' ? false : undefined)),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { page, identifiantUtilisateur, role, identifiantGestionnaireReseau, region, zni } =
      paramsSchema.parse(searchParams);

    const utilisateurs = await mediator.send<ListerUtilisateursQuery>({
      type: 'Utilisateur.Query.ListerUtilisateurs',
      data: {
        roles: role ? [Role.convertirEnValueType(role).nom] : undefined,
        identifiantUtilisateur,
        range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
        identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
        région: region,
        zni,
      },
    });
    const filters: ListFilterItem<keyof z.infer<typeof paramsSchema>>[] = [
      {
        label: 'Rôle',
        searchParamKey: 'role',
        options: listeDesRoles,
        affects: ['identifiantGestionnaireReseau', 'region'],
      },
    ];

    if (role === Role.grd.nom) {
      const gestionnairesRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {},
        });
      filters.push({
        label: 'Gestionnaire Réseau',
        searchParamKey: 'identifiantGestionnaireReseau',
        options: gestionnairesRéseau.items.map(
          ({ raisonSociale, identifiantGestionnaireRéseau: { codeEIC } }) => ({
            label: raisonSociale,
            value: codeEIC,
          }),
        ),
      });
    }
    if (role === Role.dreal.nom) {
      filters.push({
        label: 'ZNI',
        searchParamKey: 'zni',
        options: [
          { label: 'Oui', value: 'true' },
          { label: 'Non', value: 'false' },
        ],
      });
      const régions =
        zni !== undefined
          ? Région.régions
              .map(Région.convertirEnValueType)
              .filter((r) => zni === r.isZNI())
              .map((r) => r.formatter())
          : Région.régions;
      filters.push({
        label: 'Région',
        searchParamKey: 'region',
        options: régions
          .map((nom) => ({
            label: nom,
            value: nom,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      });
    }

    const identifiantsGestionnaireRéseau = new Set(
      utilisateurs.items.map((u) => u.identifiantGestionnaireRéseau).filter(Option.isSome),
    );

    const gestionnairesRéseau =
      identifiantsGestionnaireRéseau.size > 0
        ? await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
            type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
            data: {
              identifiants: Array.from(identifiantsGestionnaireRéseau),
            },
          })
        : { items: [] };

    const getMailToAction = async (): Promise<
      UtilisateurListPageProps['mailtoAction'] | undefined
    > => {
      if (!role || role === Role.porteur.nom) {
        return undefined;
      }

      const { items: utilisateursÀContacter } = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          roles: [Role.convertirEnValueType(role).nom],
          identifiantUtilisateur,
          identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
          région: region,
        },
      });

      return {
        label: `Contacter ${utilisateursÀContacter.length} ${utilisateursÀContacter.length > 1 ? 'utilisateurs' : 'utilisateur'}`,
        href: `mailto:${utilisateursÀContacter.map((item) => item.identifiantUtilisateur.email).join(',')}`,
        iconId: 'fr-icon-mail-line',
      };
    };

    return (
      <UtilisateurListPage
        filters={filters}
        list={mapToListProps(utilisateurs, gestionnairesRéseau.items)}
        mailtoAction={await getMailToAction()}
      />
    );
  });
}

const mapToListProps = (
  readModel: ListerUtilisateursReadModel,
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel['items'],
): UtilisateurListPageProps['list'] => {
  return {
    items: readModel.items.map((utilisateur) => ({
      utilisateur: mapToPlainObject(utilisateur),
      gestionnaireRéseau: mapToPlainObject(
        Option.match(utilisateur.identifiantGestionnaireRéseau)
          .some(
            (identifiantGestionnaireRéseau) =>
              gestionnairesRéseau.find(
                (grd) =>
                  grd.identifiantGestionnaireRéseau.codeEIC === identifiantGestionnaireRéseau,
              ) ?? Option.none,
          )
          .none(),
      ),
    })),
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
