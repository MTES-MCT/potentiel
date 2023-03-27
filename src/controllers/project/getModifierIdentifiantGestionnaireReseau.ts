import { object, string } from 'yup';

import routes from '@routes';
import { v1Router } from '../v1Router';
import { ModifierIdentifiantGestionnaireReseauPage } from '@views';
import { errorResponse, notFoundResponse } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { EntityNotFoundError } from '@modules/shared';
import { listerGestionnaireRéseauQueryHandlerFactory } from '@potentiel/domain';
import { listProjection } from '@potentiel/pg-projections';
import { résuméProjetQueryHandler } from '@config';

const listerGestionnairesRéseau = listerGestionnaireRéseauQueryHandlerFactory({
  listGestionnaireRéseau: listProjection,
});

const schema = object({
  params: object({
    projetId: string().uuid().required(),
  }),
});

v1Router.get(
  routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(),
  safeAsyncHandler(
    {
      schema,
      onError({ request, response }) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      },
    },
    async (request, response) => {
      const { projetId } = request.params;
      const gestionnairesRéseau = await listerGestionnairesRéseau({});

      return résuméProjetQueryHandler(projetId).match(
        (projet) =>
          response.send(
            ModifierIdentifiantGestionnaireReseauPage({
              request,
              projet,
              gestionnairesRéseau: gestionnairesRéseau,
            }),
          ),
        (e) => {
          if (e instanceof EntityNotFoundError) {
            return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
          }

          return errorResponse({ request, response });
        },
      );
    },
  ),
);
