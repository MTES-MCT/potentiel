import routes from '@routes';
import { ListeGestionnairesRéseauPage } from '@views';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';

v1Router.get(
  routes.GET_LISTE_GESTIONNAIRES_RESEAU,
  asyncHandler(async (request, response) => {
    return response.send(ListeGestionnairesRéseauPage({ request }));
  }),
);
