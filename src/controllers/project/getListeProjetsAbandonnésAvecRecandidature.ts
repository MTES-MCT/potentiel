import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeProjetsAbandonnésAvecRecandidaturePage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';

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

    response.send(
      ListeProjetsAbandonnésAvecRecandidaturePage({
        request,
        projets: {
          ...projets,
          currentUrl: getCurrentUrl(request),
        },
      }),
    );
  }),
);
