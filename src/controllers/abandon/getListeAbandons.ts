import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeAbandonsPage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';

import { PermissionListerAbandons } from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { ListerAbandonsQuery } from '@potentiel/domain-views/dist/projet/lauréat/abandon/lister/listerAbandon.query';

v1Router.get(
  routes.LISTE_ABANDONS,
  vérifierPermissionUtilisateur(PermissionListerAbandons),
  asyncHandler(async (request, response) => {
    const { page, pageSize: itemsPerPage } = getPagination(request);

    const abandons = await mediator.send<ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        recandidature: true,
        pagination: { page, itemsPerPage },
      },
    });

    return response.send(
      ListeAbandonsPage({
        request,
        abandons: {
          ...abandons,
          currentUrl: getCurrentUrl(request),
        },
      }),
    );
  }),
);
