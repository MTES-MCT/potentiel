import { invaliderGF } from '@config';
import { logger } from '@core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '@modules/shared';
import routes from '@routes';
import { errorResponse, unauthorizedResponse, vérifierPermissionUtilisateur } from '../helpers';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { GFDéjàInvalidéesError, PermissionInvaliderGF } from '@modules/project';

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
  }),
});

v1Router.get(
  routes.INVALIDER_GF(),
  vérifierPermissionUtilisateur(PermissionInvaliderGF),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) =>
        response.redirect(
          addQueryParams(routes.GET_LISTE_GARANTIES_FINANCIERES, {
            ...request.params,
            error: `${error.errors.join(' ')}`,
          }),
        ),
    },
    async (request, response) => {
      const { projetId } = request.params;
      const { user } = request;
      return invaliderGF({ projetId, invalidéesPar: user }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Les garanties financières pour ce projet sont bien considérées comme à traiter.`,
              redirectUrl: routes.GET_LISTE_GARANTIES_FINANCIERES,
              redirectTitle: 'Retourner à la liste des garanties financières',
            }),
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (error instanceof GFDéjàInvalidéesError) {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                redirectUrl: routes.GET_LISTE_GARANTIES_FINANCIERES,
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
