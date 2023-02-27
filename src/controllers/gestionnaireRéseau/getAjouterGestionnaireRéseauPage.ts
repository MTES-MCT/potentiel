import routes from '@routes';
import { vérifierPermissionUtilisateur } from '../helpers';
import { v1Router } from '../v1Router';
import { PermissionConsulterGestionnaireRéseau } from '@modules/gestionnaireRéseau/consulter/consulterGestionnaireRéseau';
import asyncHandler from '../helpers/asyncHandler';
import { AjouterGestionnaireRéseauPage } from '@views';

v1Router.get(
  routes.GET_AJOUTER_GESTIONNAIRE_RESEAU,
  vérifierPermissionUtilisateur(PermissionConsulterGestionnaireRéseau),
  asyncHandler(async (request, response) => {
    const {
      user,
      query: { error },
    } = request;

    return response.send(
      AjouterGestionnaireRéseauPage({
        utilisateur: user,
        error: error as string,
      }),
    );
  }),
);
