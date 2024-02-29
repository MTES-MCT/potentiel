import asyncHandler from '../helpers/asyncHandler';
import fs from 'fs';
import { ensureRole } from '../../config';
import { submitGF } from '../../config/useCases.config';
import { logger, ok, err } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import {
  errorResponse,
  unauthorizedResponse,
  iso8601DateToDateYupTransformation,
  validateRequestBodyForErrorArray,
  RequestValidationErrorArray,
} from '../helpers';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import {
  CertificateFileIsMissingError,
  DateEchéanceIncompatibleAvecLeTypeDeGFError,
  GFCertificateHasAlreadyBeenSentError,
  GFImpossibleASoumettreError,
} from '../../modules/project';
import { format } from 'date-fns';
import * as yup from 'yup';
import { pathExists } from '../../helpers/pathExists';

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  stepDate: yup
    .date()
    .transform(iso8601DateToDateYupTransformation)
    .max(
      format(new Date(), 'yyyy-MM-dd'),
      "La date de constitution ne doit dépasser la date d'aujourd'hui.",
    )
    .required('Vous devez renseigner la date de constitution.')
    .typeError(`La date de constitution n'est pas valide.`),
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
});

v1Router.post(
  routes.SUBMIT_GARANTIES_FINANCIERES(),
  ensureRole(['porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .andThen((body) => {
        if (!request.file || !pathExists(request.file.path)) {
          return err(new CertificateFileIsMissingError());
        }
        return ok(body);
      })
      .asyncAndThen((body) => {
        const { stepDate, projectId, dateEcheance: dateEchéance, type } = body;
        const { user: submittedBy } = request;
        if (dateEchéance && type !== "Garantie financière avec date d'échéance et à renouveler") {
          throw err(new DateEchéanceIncompatibleAvecLeTypeDeGFError());
        }
        const file = {
          contents: fs.createReadStream(request.file!.path),
          filename: `${Date.now()}-${request.file!.originalname}`,
        };

        return submitGF({ projectId, stepDate, dateEchéance, type, file, submittedBy }).map(() => ({
          projectId,
        }));
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre attestation de garanties financières a bien été soumise.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          );
        },
        (error) => {
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                ...request.body,
                error: `${error.message} ${error.errors.join(' ')}`,
              }),
            );
          }

          if (
            error instanceof CertificateFileIsMissingError ||
            error instanceof GFCertificateHasAlreadyBeenSentError ||
            error instanceof GFImpossibleASoumettreError ||
            error instanceof DateEchéanceIncompatibleAvecLeTypeDeGFError
          ) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                error: error.message,
              }),
            );
          }

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
  }),
);
