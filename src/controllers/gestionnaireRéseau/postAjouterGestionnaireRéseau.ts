import routes from '@routes';
import { errorResponse, vérifierPermissionUtilisateur } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';

import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import {
  DomainUseCase,
  PermissionAjouterGestionnaireRéseau,
  convertirEnIdentifiantGestionnaireRéseau,
} from '@potentiel/domain';
import { InvalidOperationError } from '@potentiel/core-domain';
import { mediator } from 'mediateur';

const schema = yup.object({
  body: yup.object({
    codeEIC: yup.string().required('Le code EIC est obligatoire'),
    raisonSociale: yup.string().required('La raison sociale est obligatoire'),
    format: yup.string().optional(),
    légende: yup.string().optional(),
    expressionReguliere: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_AJOUTER_GESTIONNAIRE_RESEAU,
  vérifierPermissionUtilisateur(PermissionAjouterGestionnaireRéseau),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error, errors }) => {
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
      const {
        codeEIC,
        format = '',
        légende = '',
        raisonSociale,
        expressionReguliere = '',
      } = request.body;

      try {
        await mediator.send<DomainUseCase>({
          type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
          data: {
            identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
            aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
            raisonSociale,
          },
        });

        response.redirect(
          addQueryParams(routes.GET_LISTE_GESTIONNAIRES_RESEAU, {
            success: 'Le gestionnaire a bien été enregistré.',
          }),
        );
      } catch (error) {
        if (error instanceof InvalidOperationError) {
          return response.redirect(
            addQueryParams(routes.GET_AJOUTER_GESTIONNAIRE_RESEAU, {
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
