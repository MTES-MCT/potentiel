import routes from '@routes';
import { ConsulterGestionnairesRéseauPage } from '@views';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { PermissionConsulterGestionnaireRéseau } from '@modules/gestionnaireRéseau/consulter/consulterGestionnaireRéseau';
import { consulterGestionnaireRéseauQueryHandler } from '@infra/sequelize/queries/gestionnaireRéseau/consulterGestionnaireRéseau';

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
      } = request;
      const gestionnaireRéseau = await consulterGestionnaireRéseauQueryHandler({ codeEIC });

      if (!gestionnaireRéseau) {
        return notFoundResponse({ request, response, ressourceTitle: 'Gestionnaire réseau' });
      }

      return response.send(
        ConsulterGestionnairesRéseauPage({
          utilisateur: user,
          gestionnaireRéseau,
        }),
      );
    },
  ),
);
