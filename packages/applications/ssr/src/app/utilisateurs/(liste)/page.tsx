import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { RedirectType, redirect } from 'next/navigation';
import { z } from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import {
  type ConsulterUtilisateurReadModel,
  type ListerUtilisateursQuery,
  type ListerUtilisateursReadModel,
  Role,
  Région,
  type Utilisateur,
  Zone,
} from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { ListFilterItem } from '@/components/molecules/ListFilters';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { listeDesRoles } from '@/utils/utilisateur/format-role';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getZoneLabel } from '../_helpers/getZoneLabel';
import { UtilisateurListPage, type UtilisateurListPageProps } from './UtilisateurList.page';
import type { UtilisateurListItemProps } from './UtilisateurListItem';

export const metadata: Metadata = {
  title: 'Utilisateurs',
};

type PageProps = {
  searchParams?: Promise<Record<string, string>>;
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  identifiantUtilisateur: z.string().optional(),
  role: z.string().optional(),
  identifiantGestionnaireReseau: z.string().optional(),
  region: z.string().optional(),
  zone: z.string().optional(),
  zni: z.stringbool().optional(),
  actif: z.stringbool().optional(),
});

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const activeFilters = paramsSchema.parse(searchParams);

      const {
        page,
        identifiantUtilisateur,
        role,
        identifiantGestionnaireReseau,
        region,
        zone,
        zni,
        actif,
      } = activeFilters;

      const filtresUtilisateurs = {
        roles: role ? [Role.convertirEnValueType(role).nom] : undefined,
        identifiantUtilisateur,
        identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
        région: region,
        zones: zone ? [zone] : undefined,
        zni,
        actif,
      };

      const utilisateurs = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          ...filtresUtilisateurs,
          range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
        },
      });

      const filters: ListFilterItem<keyof z.infer<typeof paramsSchema>>[] = [
        {
          label: 'Rôle',
          searchParamKey: 'role',
          options: listeDesRoles,
          affects: ['identifiantGestionnaireReseau', 'region', 'zni', 'zone'],
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
          mutuallyExclusiveWith: ['zni'],
          options: régions
            .map((nom) => ({
              label: nom,
              value: nom,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        });
        filters.push({
          label: 'ZNI',
          searchParamKey: 'zni',
          options: [
            { label: 'Oui', value: 'true' },
            { label: 'Non', value: 'false' },
          ],
          mutuallyExclusiveWith: ['region'],
        });
      }
      if (role === Role.cocontractant.nom) {
        filters.push({
          label: 'Zone',
          searchParamKey: 'zone',
          options: Zone.zones.map((zone) => ({
            label: getZoneLabel(zone),
            value: zone,
          })),
        });
      }
      filters.push({
        label: 'Actif',
        searchParamKey: 'actif',
        options: [
          { label: 'Oui', value: 'true' },
          { label: 'Non', value: 'false' },
        ],
      });

      const orphansFilters = Object.keys(activeFilters).filter(
        (key) =>
          !filters.find((x) => x.searchParamKey === key) &&
          !['page', 'identifiantUtilisateur'].includes(key),
      );

      if (orphansFilters.length > 0) {
        const newSearchParams = new URLSearchParams(searchParams);

        for (const orphanFilter of orphansFilters) {
          newSearchParams.delete(orphanFilter);
        }

        redirect(`${Routes.Utilisateur.lister()}?${newSearchParams}`, RedirectType.replace);
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

      const getMenuActions = async (): Promise<UtilisateurListPageProps['actions']> => {
        const actions: Array<UtilisateurListPageProps['actions'][number]> = [
          {
            label: 'Inviter un utilisateur',
            href: Routes.Utilisateur.inviter,
          },
        ];
        if (role && role !== Role.porteur.nom) {
          const { items: utilisateursÀContacter } = await mediator.send<ListerUtilisateursQuery>({
            type: 'Utilisateur.Query.ListerUtilisateurs',
            data: { ...filtresUtilisateurs, actif: true },
          });
          actions.push({
            label: `Contacter ${utilisateursÀContacter.length} ${utilisateursÀContacter.length > 1 ? 'utilisateurs' : 'utilisateur'}`,
            href: `mailto:${utilisateursÀContacter.map((item) => item.identifiantUtilisateur.email).join(',')}`,
            iconId: 'fr-icon-mail-line',
          });
        }

        return actions;
      };

      return (
        <UtilisateurListPage
          filters={filters}
          list={mapToListProps(utilisateurs, gestionnairesRéseau.items, utilisateur)}
          actions={await getMenuActions()}
        />
      );
    }),
  );
}

const mapToListProps = (
  readModel: ListerUtilisateursReadModel,
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel['items'],
  utilisateurConnecté: Utilisateur.ValueType,
): UtilisateurListPageProps['list'] => {
  return {
    items: readModel.items.map((utilisateur) => ({
      utilisateur: {
        ...mapToPlainObject(utilisateur),
        actions: mapToActionsByUser(utilisateur, utilisateurConnecté),
      },
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

const mapToActionsByUser = (
  utilisateur: ConsulterUtilisateurReadModel,
  utilisateurConnecté: Utilisateur.ValueType,
): UtilisateurListItemProps['utilisateur']['actions'] => {
  if (utilisateurConnecté.identifiantUtilisateur.estÉgaleÀ(utilisateur.identifiantUtilisateur)) {
    return [];
  }

  const actions: UtilisateurListItemProps['utilisateur']['actions'] = [];

  if (utilisateur.désactivé) {
    if (utilisateurConnecté.rôle.aLaPermission('utilisateur.réactiver')) {
      actions.push('réactiver');
    }
  } else if (utilisateurConnecté.rôle.aLaPermission('utilisateur.désactiver')) {
    actions.push('désactiver');
  }
  
  if (utilisateurConnecté.rôle.aLaPermission('utilisateur.modifierRôle')) {
    actions.push('modifier');
  }

  return actions;
};
