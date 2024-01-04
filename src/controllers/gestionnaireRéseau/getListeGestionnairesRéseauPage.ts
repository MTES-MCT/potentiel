import {
  PermissionListerGestionnairesRéseau,
  ListerGestionnaireRéseauQuery,
} from '@potentiel/domain-views';
import { ListeGestionnairesRéseauPage } from '../../views';
import { vérifierPermissionUtilisateur } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { mediator } from 'mediateur';
import { GET_LISTE_GESTIONNAIRES_RESEAU } from '@potentiel/legacy-routes';

v1Router.get(
  GET_LISTE_GESTIONNAIRES_RESEAU,
  vérifierPermissionUtilisateur(PermissionListerGestionnairesRéseau),
  asyncHandler(async (request, response) => {
    const { items: gestionnairesRéseau } = await mediator.send<ListerGestionnaireRéseauQuery>({
      type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {},
    });
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
