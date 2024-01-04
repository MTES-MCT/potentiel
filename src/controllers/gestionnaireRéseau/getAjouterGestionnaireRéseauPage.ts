import { vérifierPermissionUtilisateur } from '../helpers';
import { v1Router } from '../v1Router';
import { PermissionConsulterGestionnaireRéseau } from '@potentiel/domain-views';
import asyncHandler from '../helpers/asyncHandler';
import { AjouterGestionnaireRéseauPage } from '../../views';
import { GET_AJOUTER_GESTIONNAIRE_RESEAU } from '@potentiel/legacy-routes';

v1Router.get(
  GET_AJOUTER_GESTIONNAIRE_RESEAU,
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
