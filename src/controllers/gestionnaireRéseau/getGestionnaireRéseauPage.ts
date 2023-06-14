import routes from '@routes';
import { ConsulterGestionnairesRéseauPage } from '@views';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import {
  ConsulterGestionnaireRéseauQuery,
  PermissionConsulterGestionnaireRéseau,
} from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({ codeEIC: yup.string().required() }),
});

v1Router.get(
  routes.GET_DETAIL_GESTIONNAIRE_RESEAU(),
  vérifierPermissionUtilisateur(PermissionConsulterGestionnaireRéseau),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Gestionnaire réseau' }),
    },
    async (request, response) => {
      const {
        user,
        params: { codeEIC },
        query: { errors },
      } = request;
      const gestionnaireRéseau = await mediator.send<ConsulterGestionnaireRéseauQuery>({
        type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {
          identifiantGestionnaireRéseau: codeEIC,
        },
      });

      if (isNone(gestionnaireRéseau)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Gestionnaire réseau' });
      }

      return response.send(
        ConsulterGestionnairesRéseauPage({
          utilisateur: user,
          gestionnaireRéseau,
          erreurValidation: errors ? JSON.parse(errors as string) : undefined,
        }),
      );
    },
  ),
);
