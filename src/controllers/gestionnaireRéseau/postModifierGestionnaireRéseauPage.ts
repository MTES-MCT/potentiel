import routes from '@routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';

import { addQueryParams } from '../../helpers/addQueryParams';
import { modifierGestionnaireRéseau } from '@config';
import { GestionnaireRéseauInconnuError } from '@modules/gestionnaireRéseau/modifier/gestionnaireRéseauInconnu.error';
import { logger } from '@core/utils';
import { errorResponse } from '../helpers';

const schema = yup.object({
  body: yup.object({
    raisonSociale: yup.string().required('La raison sociale est obligatoire'),
    format: yup.string().optional(),
    légende: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(),
  // vérifierPermissionUtilisateur(PermissionAjouterGestionnaireRéseau),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error, errors }) => {
        response.redirect(
          addQueryParams(routes.GET_DETAIL_GESTIONNAIRE_RESEAU(request.params.codeEIC), {
            ...request.body,
            error,
            errors: JSON.stringify(errors),
          }),
        );
      },
    },
    async (request, response) => {
      const {
        body: { format = '', légende = '', raisonSociale },
        params: { codeEIC },
      } = request;
      console.log(codeEIC);
      try {
        await modifierGestionnaireRéseau({
          codeEIC,
          aideSaisieRéférenceDossierRaccordement: { format, légende },
          raisonSociale,
        });
        response.redirect(
          addQueryParams(routes.GET_DETAIL_GESTIONNAIRE_RESEAU(codeEIC), {
            success: 'Le gestionnaire a bien été modifié.',
          }),
        );
      } catch (error) {
        if (error instanceof GestionnaireRéseauInconnuError) {
          return response.redirect(
            addQueryParams(routes.GET_LISTE_GESTIONNAIRES_RESEAU, {
              error: error.message,
            }),
          );
        }

        logger.error(error);
        return errorResponse({
          request,
          response,
          customMessage: `Une erreur est survenue. Veuillez répéter l'opération ou contacter un administrateur.`,
        });
      }
    },
  ),
);
