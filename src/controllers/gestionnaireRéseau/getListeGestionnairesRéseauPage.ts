import {
  PermissionListerGestionnairesRéseau,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { listProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { ListeGestionnairesRéseauPage } from '@views';
import { vérifierPermissionUtilisateur } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';

const listerGestionnairesRéseau = listerGestionnaireRéseauQueryHandlerFactory({
  list: listProjection,
});

v1Router.get(
  routes.GET_LISTE_GESTIONNAIRES_RESEAU,
  vérifierPermissionUtilisateur(PermissionListerGestionnairesRéseau),
  asyncHandler(async (request, response) => {
    const gestionnairesRéseau = await listerGestionnairesRéseau({});
    const {
      user,
      query: { success },
    } = request;
    return response.send(
      ListeGestionnairesRéseauPage({
        user,
        gestionnairesRéseau,
        success: success as string,
      }),
    );
  }),
);
