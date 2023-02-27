import routes from '@routes';
import { errorResponse, vérifierPermissionUtilisateur } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { PermissionAjouterGestionnaireRéseau } from '@modules/gestionnaireRéseau';
import { addQueryParams } from '../../helpers/addQueryParams';
import { ajouterGestionnaireRéseau } from '@config';
import { GestionnaireRéseauDéjàExistantError } from '@modules/gestionnaireRéseau/ajouter/gestionnaireRéseauDéjàExistantError';
import { logger } from '@core/utils';

const schema = yup.object({
  body: yup.object({
    codeEIC: yup.string().required('Le code EIC est obligatoire'),
    raisonSociale: yup.string().required('La raison sociale est obligatoire'),
    format: yup.string().optional(),
    légende: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_AJOUTER_GESTIONNAIRE_RESEAU,
  vérifierPermissionUtilisateur(PermissionAjouterGestionnaireRéseau),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error, errors }) => {
        console.table(errors);
        response.redirect(
          addQueryParams(routes.GET_AJOUTER_GESTIONNAIRE_RESEAU, {
            ...request.body,
            error,
            errors: JSON.stringify(errors),
          }),
        );
      },
    },
    async (request, response) => {
      const { codeEIC, format, légende, raisonSociale } = request.body;

      return ajouterGestionnaireRéseau({ codeEIC, format, légende, raisonSociale }).match(
        () =>
          response.redirect(
            addQueryParams(routes.GET_LISTE_GESTIONNAIRES_RESEAU, {
              success: 'Le gestionnaire a bien été enregistré.',
            }),
          ),
        (e) => {
          if (e instanceof GestionnaireRéseauDéjàExistantError) {
            return response.redirect(
              addQueryParams(routes.GET_AJOUTER_GESTIONNAIRE_RESEAU, {
                error: e.message,
              }),
            );
          }

          logger.error(e);
          return errorResponse({
            request,
            response,
            customMessage: `Une erreur est survenue. Veuillez répéter l'opération ou contacter un administrateur.`,
          });
        },
      );
    },
  ),
);
