import * as yup from 'yup';

import { confirmerDemandeAbandon, ensureRole, getIdentifiantProjetByLegacyId } from '../../config';
import { logger, wrapInfra } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { errorResponse, unauthorizedResponse } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { mediator } from 'mediateur';

import { Abandon } from '@potentiel-domain/laureat';

const schema = yup.object({
  body: yup.object({
    demandeAbandonId: yup.string().uuid().required(),
    projectId: yup.string().uuid().required(),
  }),
});

v1Router.post(
  routes.CONFIRMER_DEMANDE_ABANDON,
  ensureRole(['porteur-projet']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.GET_DEMANDER_ABANDON(request.body.demandeAbandonId), {
            ...error.errors,
          }),
        ),
    },
    async (request, response) => {
      const { user } = request;
      const { projectId, demandeAbandonId } = request.body;

      const sendToMediator = new Promise<void>(async (resolve) => {
        const result = await getIdentifiantProjetByLegacyId(projectId);
        const identifiantProjetValue = result?.identifiantProjetValue || '';

        try {
          await mediator.send<Abandon.AbandonUseCase>({
            type: 'CONFIRMER_ABANDON_USECASE',
            data: {
              dateConfirmationValue: new Date().toISOString(),
              identifiantProjetValue,
              identifiantUtilisateurValue: request.user.email,
            },
          });
        } catch (e) {
          logger.error(e);
        }

        resolve();
      });

      return confirmerDemandeAbandon({
        confirméPar: user,
        demandeAbandonId,
      })
        .andThen(() => wrapInfra(sendToMediator))
        .match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `Votre demande d'abandon a bien été envoyée.`,
                redirectUrl: routes.PROJECT_DETAILS(projectId),
                redirectTitle: 'Retourner à la page projet',
              }),
            );
          },
          (error) => {
            if (error instanceof UnauthorizedError) {
              return unauthorizedResponse({ request, response });
            }

            logger.error(error);
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            });
          },
        );
    },
  ),
);
