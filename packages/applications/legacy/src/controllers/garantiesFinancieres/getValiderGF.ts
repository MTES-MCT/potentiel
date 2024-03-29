import { validerGF } from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import { errorResponse, unauthorizedResponse } from '../helpers';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { GFDéjàValidéesError, PermissionValiderGF } from '../../modules/project';
import { vérifierPermissionUtilisateur } from '../helpers/vérifierPermissionUtilisateur';

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
  }),
});

v1Router.get(
  routes.VALIDER_GF(),
  vérifierPermissionUtilisateur(PermissionValiderGF),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) =>
        response.redirect(
          addQueryParams(routes.ADMIN_GARANTIES_FINANCIERES, {
            ...request.params,
            error: `${error.errors.join(' ')}`,
          }),
        ),
    },
    async (request, response) => {
      const { projetId } = request.params;
      const { user } = request;
      return validerGF({ projetId, validéesPar: user }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Les garanties financières pour ce projet sont bien considérées comme validées.`,
              redirectUrl: routes.ADMIN_GARANTIES_FINANCIERES,
              redirectTitle: 'Retourner à la liste des garanties financières',
            }),
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (error instanceof GFDéjàValidéesError) {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                redirectUrl: routes.ADMIN_GARANTIES_FINANCIERES,
                redirectTitle: 'Retourner à la liste des garanties financières',
                error: error.message,
              }),
            );
          }

          logger.error(error);
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Veuillez nous contacter si le problème persiste.',
          });
        },
      );
    },
  ),
);
