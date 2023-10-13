import routes from '@potentiel/routes';
import { vérifierPermissionUtilisateur } from '../helpers';
import { v1Router } from '../v1Router';
import { PermissionConsulterGestionnaireRéseau } from '@potentiel/domain-views';
import asyncHandler from '../helpers/asyncHandler';
import { AjouterGestionnaireRéseauPage } from '../../views';

v1Router.get(
  routes.GET_AJOUTER_GESTIONNAIRE_RESEAU,
  vérifierPermissionUtilisateur(PermissionConsulterGestionnaireRéseau),
  asyncHandler(async (request, response) => {
    const {
      user,
      query: { error, errors },
    } = request;

    return response.send(
      AjouterGestionnaireRéseauPage({
        utilisateur: user,
        erreur: error as string,
        erreurValidation: errors ? JSON.parse(errors as string) : undefined,
      }),
    );
  }),
);
