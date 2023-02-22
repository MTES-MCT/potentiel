import { logger } from '@core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '@modules/shared';
import routes from '@routes';
import {
  errorResponse,
  unauthorizedResponse,
  iso8601DateToDateYupTransformation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionAjouterDateExpirationGF } from '@modules/project/useCases';
import { addGFExpirationDate } from '@config/useCases.config';

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    expirationDate: yup
      .date()
      .required("Vous devez renseigner la date d'échéance.")
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'échéance saisie n'est pas valide.`),
  }),
});

v1Router.post(
  routes.ADD_GF_EXPIRATION_DATE(),
  vérifierPermissionUtilisateur(PermissionAjouterDateExpirationGF),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
            ...request.body,
            error: `${error.errors.join(' ')}`,
          }),
        ),
    },
    async (request, response) => {
      const { projectId, expirationDate } = request.body;
      const { user: submittedBy } = request;
      return addGFExpirationDate({ projectId, expirationDate, submittedBy }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: "La date d'échéance des garanties financières a bien été enregistrée.",
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          ),
        (error: Error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
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
