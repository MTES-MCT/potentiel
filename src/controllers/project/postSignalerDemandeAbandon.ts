import fs from 'fs';
import { ensureRole, signalerDemandeAbandon } from '../../config';
import { logger } from '../../core/utils';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  unauthorizedResponse,
} from '../helpers';
import { UnauthorizedError } from '../../modules/shared';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { upload } from '../upload';
import * as yup from 'yup';
import { addQueryParams } from '../../helpers/addQueryParams';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { DemandeDeMêmeTypeDéjàOuverteError } from '../../modules/project/errors/DemandeDeMêmeTypeDéjàOuverteError';

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    decidedOn: yup
      .date()
      .required('Ce champ est obligatoire')
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date saisie n'est pas valide`),
    status: yup
      .mixed<'acceptée' | 'rejetée'>()
      .oneOf(['acceptée', 'rejetée'])
      .required('Ce champ est obligatoire')
      .typeError(`Le status n'est pas valide`),
    notes: yup.string().optional(),
  }),
});

v1Router.post(
  routes.ADMIN_SIGNALER_DEMANDE_ABANDON_POST,
  upload.single('file'),
  ensureRole(['admin', 'dgec-validateur']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, errors }) => {
        response.redirect(
          addQueryParams(routes.ADMIN_SIGNALER_DEMANDE_ABANDON_GET(request.body.projectId), {
            ...request.body,
            ...errors,
          }),
        );
      },
    },
    async (request, response) => {
      const { projectId, decidedOn, status, notes } = request.body;
      const { user: signaledBy } = request;

      const file = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };

      return signalerDemandeAbandon({
        projectId,
        decidedOn,
        status,
        notes,
        file,
        signaledBy,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre signalement de demande d'abandon a bien été enregistré.`,
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          );
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (error instanceof DemandeDeMêmeTypeDéjàOuverteError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_SIGNALER_DEMANDE_ABANDON_GET(request.body.projectId), {
                error: error.message,
                ...request.body,
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
