import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeAbandonsPage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';
import { getListLegacyIdsByIdentifiantsProjet } from '../../infra/sequelize/queries/project';
import { getListModificationRequestIdsByLegacyIds } from '../../infra/sequelize/queries/modificationRequest';

import {
  PermissionListerAbandons,
} from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { none } from '@potentiel/monads';
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

    if (!abandons.items.length) {
      return response.send(
        ListeAbandonsPage({
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
      ListeAbandonsPage({
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
