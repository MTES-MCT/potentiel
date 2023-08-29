import {
  PermissionModifierGestionnaireRéseauProjet,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { ModifierGestionnaireRéseauProjetPage } from '../../views';
import { mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import { ConsulterProjetQuery, ListerGestionnaireRéseauQuery } from '@potentiel/domain-views';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
});

v1Router.get(
  routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(),
  vérifierPermissionUtilisateur(PermissionModifierGestionnaireRéseauProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        query: { error },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await mediator.send<ConsulterProjetQuery>({
        type: 'CONSULTER_PROJET',
        data: {
          identifiantProjet: identifiantProjetValueType,
        },
      });

      if (isNone(projet)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const { items: listeGestionnairesRéseau } =
        await mediator.send<ListerGestionnaireRéseauQuery>({
          type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
          data: {},
        });

      return response.send(
        ModifierGestionnaireRéseauProjetPage({
          user,
          listeGestionnairesRéseau,
          projet,
          error: error as string,
        }),
      );
    },
  ),
);
