import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { ListeAbandonsPage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';

import { ConsulterCandidatureLegacyQuery, PermissionListerAbandons } from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { isSome } from '@potentiel/monads';

v1Router.get(
  routes.LISTE_ABANDONS,
  vérifierPermissionUtilisateur(PermissionListerAbandons),
  asyncHandler(async (request, response) => {
    const { page, pageSize: itemsPerPage } = getPagination(request);

    const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        recandidature: true,
        pagination: { page, itemsPerPage },
      },
    });

    const abandonsWithProjet = await Promise.all(
      abandons.items.map(async (a) => {
        const projet = await mediator.send<ConsulterCandidatureLegacyQuery>({
          type: 'CONSULTER_CANDIDATURE_LEGACY_QUERY',
          data: {
            identifiantProjet: a.identifiantProjet,
          },
        });

        return {
          ...a,
          projet: isSome(projet) ? projet : undefined,
        };
      }),
    );

    return response.send(
      ListeAbandonsPage({
        request,
        abandons: {
          ...abandons,
          items: abandonsWithProjet,
        },
        currentUrl: getCurrentUrl(request),
      }),
    );
  }),
);
