import * as yup from 'yup';

import { ensureRole, demanderAnnulationAbandon } from '@config';
import { logger } from '@core/utils';
import { UnauthorizedError } from '@modules/shared';
import routes from '@routes';

import { addQueryParams } from '../../../helpers/addQueryParams';
import { errorResponse, unauthorizedResponse } from '../../helpers';
import { v1Router } from '../../v1Router';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import {
  CDCIncompatibleAvecAnnulationAbandonError,
  ProjetNonAbandonnéError,
} from '@modules/demandeModification';

const schema = yup.object({
  body: yup.object({
    projetId: yup.string().uuid().required(),
  }),
});

v1Router.post(
  routes.POST_DEMANDER_ANNULATION_ABANDON,
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.body.projetId), {
            ...error.errors,
          }),
        ),
    },
    async (request, response) => {
      const {
        user,
        body: { projetId },
      } = request;

      return demanderAnnulationAbandon({
        user,
        projetId,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre demande a bien été envoyée.`,
              redirectUrl: routes.PROJECT_DETAILS(projetId),
              redirectTitle: 'Retourner à la page projet',
            }),
          );
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (
            error instanceof CDCIncompatibleAvecAnnulationAbandonError ||
            error instanceof ProjetNonAbandonnéError
          ) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projetId), {
                error: error.message,
              }),
            );
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
