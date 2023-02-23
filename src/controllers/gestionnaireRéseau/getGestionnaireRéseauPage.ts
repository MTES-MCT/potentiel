import routes from '@routes';
import { ConsulterGestionnairesRéseauPage } from '@views';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { PermissionConsulterGestionnaireRéseau } from '@modules/gestionnaireRéseau/consulter/consulterGestionnaireRéseau';

const schema = yup.object({
  params: yup.object({ id: yup.string().required() }),
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
      const { user } = request;
      return response.send(
        ConsulterGestionnairesRéseauPage({
          utilisateur: user,
        }),
      );
    },
  ),
);
