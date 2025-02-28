import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { z } from 'zod';

import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
  Role,
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

export const metadata: Metadata = {
  title: 'Inviter au projet - Potentiel',
  description: 'Inviter un utilisateur sur le projet',
};

type PageProps = {
  searchParams?: Record<string, string>;
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  role: z.string().optional(),
  identifiantUtilisateur: z.string().optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { page, identifiantUtilisateur, role } = paramsSchema.parse(searchParams);

    const utilisateurs = await mediator.send<ListerUtilisateursQuery>({
      type: 'Utilisateur.Query.ListerUtilisateurs',
      data: {
        roles: role ? [Role.convertirEnValueType(role).nom] : undefined,
        identifiantUtilisateur,
        range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
      },
    });
    const filters = [
      {
        label: 'Rôle',
        searchParamKey: 'role',
        options: listeDesRoles,
      },
    ];

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

    return (
      <UtilisateurListPage
        filters={filters}
        list={mapToListProps(utilisateurs, gestionnairesRéseau.items)}
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
