import fs from 'fs';
import { uploadGF } from '@config/useCases.config';
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
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { GFCertificateHasAlreadyBeenSentError, PermissionUploaderGF } from '../../modules/project';
import { format } from 'date-fns';
import * as yup from 'yup';
import { pathExists } from '../../helpers/pathExists';
import safeAsyncHandler from '../helpers/safeAsyncHandler';

const schema = yup.object({
  body: yup.object({
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
    expirationDate: yup
      .date()
      .transform(iso8601DateToDateYupTransformation)
      .required("Vous devez renseigner la date d'échéance.")
      .typeError(`La date d'échéance saisie n'est pas valide.`),
    type: yup.mixed().oneOf(['garanties-financieres']).required('Ce champ est obligatoire.'),
  }),
});

v1Router.post(
  routes.UPLOAD_GARANTIES_FINANCIERES(),
  vérifierPermissionUtilisateur(PermissionUploaderGF),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
            ...request.body,
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      if (!request.file || !pathExists(request.file.path)) {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
            error:
              "L'attestation de constitution des garanties financières n'a pas pu être envoyée. Vous devez joindre un fichier.",
          }),
        );
      }
      const { stepDate, projectId, expirationDate } = request.body;
      const { user: submittedBy } = request;
      const file = {
        contents: fs.createReadStream(request.file!.path),
        filename: `${Date.now()}-${request.file!.originalname}`,
      };

      return uploadGF({ projectId, stepDate, expirationDate, file, submittedBy })
        .map(() => ({
          projectId,
        }))
        .match(
          ({ projectId }) => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: 'Votre attestation de garanties financières a bien été enregistrée.',
                redirectUrl: routes.PROJECT_DETAILS(projectId),
                redirectTitle: 'Retourner à la page projet',
              }),
            );
          },
          (error) => {
            if (error instanceof GFCertificateHasAlreadyBeenSentError) {
              return response.redirect(
                addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                  error:
                    "Il semblerait qu'il y ait déjà une garantie financière en cours de validité sur ce projet.",
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
    },
  ),
);
