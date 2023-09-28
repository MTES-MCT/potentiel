import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsAbandonnésAvecRecandidaturePage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';
import { getListLegacyIdsByIdentifiantsProjet } from '../../infra/sequelize/queries/project';
import { getListModificationRequestIdsByLegacyIds } from '../../infra/sequelize/queries/modificationRequest';

import {
  ListerProjetEnAttenteRecandidatureQuery,
  PermissionListerProjetsAbandonnésAvecRecandidature,
} from '@potentiel/domain-views';
import { mediator } from 'mediateur';

v1Router.get(
  routes.LISTE_PROJETS_ABANDONNÉS_AVEC_RECANDIDATURE,
  vérifierPermissionUtilisateur(PermissionListerProjetsAbandonnésAvecRecandidature),
  asyncHandler(async (request, response) => {
    const { page, pageSize: itemsPerPage } = getPagination(request);

    const projets = await mediator.send<ListerProjetEnAttenteRecandidatureQuery>({
      type: 'LISTER_PROJET_EN_ATTENTE_RECANDIDATURE_QUERY',
      data: {
        pagination: { page, itemsPerPage },
      },
    });

    if (!projets.items.length) {
      return response.send(
        ListeProjetsAbandonnésAvecRecandidaturePage({
          request,
          projetsLegacyIds,
          modificationsRequestIds,
          projets: {
            ...projets,
            currentUrl: getCurrentUrl(request),
          },
        }),
      );
    }

    const projetsLegacyIds = await getListLegacyIdsByIdentifiantsProjet(
      projets.items.map((p) => ({
        appelOffre: p.appelOffre,
        période: p.période,
        famille: p.famille,
        numéroCRE: p.numéroCRE,
      })),
    );

    const modificationsRequestIds = await getListModificationRequestIdsByLegacyIds(
      projetsLegacyIds,
    );

    return response.send(
      ListeProjetsAbandonnésAvecRecandidaturePage({
        request,
        projetsLegacyIds,
        modificationsRequestIds,
        projets: {
          ...projets,
          currentUrl: getCurrentUrl(request),
        },
      }),
    );
  }),
);
