import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsAbandonnésAvecRecandidaturePage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';
import { getListLegacyIdsByIdentifiantsProjet } from '../../infra/sequelize/queries/project';
import { getListModificationRequestIdsByLegacyIds } from '../../infra/sequelize/queries/modificationRequest';

import {
  PermissionListerProjetsAbandonnésAvecRecandidature,
  ListerAbandonAvecRecandidatureQuery,
} from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { none } from '@potentiel/monads';

v1Router.get(
  routes.LISTE_PROJETS_ABANDONNÉS_AVEC_RECANDIDATURE,
  vérifierPermissionUtilisateur(PermissionListerProjetsAbandonnésAvecRecandidature),
  asyncHandler(async (request, response) => {
    const { page, pageSize: itemsPerPage } = getPagination(request);

    const abandons = await mediator.send<ListerAbandonAvecRecandidatureQuery>({
      type: 'LISTER_ABANDON_AVEC_RECANDIDATURE_QUERY',
      data: {
        pagination: { page, itemsPerPage },
      },
    });

    if (!abandons.items.length) {
      return response.send(
        ListeProjetsAbandonnésAvecRecandidaturePage({
          request,
          abandons: {
            ...abandons,
            currentUrl: getCurrentUrl(request),
          },
        }),
      );
    }

    const projetsLegacyIds = await getListLegacyIdsByIdentifiantsProjet(
      abandons.items.map((a) => ({
        appelOffre: a.appelOffre,
        famille: a.famille || none,
        numéroCRE: a.numéroCRE,
        période: a.période,
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
        abandons: {
          ...abandons,
          currentUrl: getCurrentUrl(request),
        },
      }),
    );
  }),
);
