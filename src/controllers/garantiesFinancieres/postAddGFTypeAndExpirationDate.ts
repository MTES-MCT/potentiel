import { err, logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import {
  errorResponse,
  unauthorizedResponse,
  iso8601DateToDateYupTransformation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionAjouterTypeEtDateEcheanceGF } from '../../modules/project/useCases';
import { addGFTypeAndExpirationDate } from '../../config/useCases.config';
import { DateEchéanceIncompatibleAvecLeTypeDeGFError } from '../../modules/project';

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    type: yup
      .mixed()
      .oneOf([
        "Garantie financière avec date d'échéance et à renouveler",
        "Garantie financière jusqu'à 6 mois après la date d'achèvement",
        'Consignation',
      ])
      .required('Vous devez préciser le type de garanties financières.'),
    dateEcheance: yup.date().when('type', {
      is: "Garantie financière avec date d'échéance et à renouveler",
      then: yup
        .date()
        .transform(iso8601DateToDateYupTransformation)
        .required("Vous devez renseigner la date d'échéance.")
        .typeError(`La date d'échéance n'est pas valide.`),
    }),
  }),
});

v1Router.post(
  routes.ADD_GF_TYPE_AND_EXPIRATION_DATE(),
  vérifierPermissionUtilisateur(PermissionAjouterTypeEtDateEcheanceGF),
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
      const { projectId, dateEcheance: dateEchéance, type } = request.body;
      const { user: submittedBy } = request;
      if (dateEchéance && type !== "Garantie financière avec date d'échéance et à renouveler") {
        throw err(new DateEchéanceIncompatibleAvecLeTypeDeGFError());
      }

      return addGFTypeAndExpirationDate({ projectId, dateEchéance, type, submittedBy }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Les garanties financières ont bien été mises à jour',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          ),
        (error: Error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (error instanceof DateEchéanceIncompatibleAvecLeTypeDeGFError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
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
