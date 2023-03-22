import fs from 'fs';
import omit from 'lodash/omit';
import * as yup from 'yup';

import { demanderDélai, ensureRole } from '@config';
import { logger } from '@core/utils';
import { DemanderDateAchèvementAntérieureDateThéoriqueError } from '@modules/demandeModification/demandeDélai/demander';
import { UnauthorizedError } from '@modules/shared';
import routes from '@routes';

import { addQueryParams } from '../../../helpers/addQueryParams';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  unauthorizedResponse,
} from '../../helpers';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';
import { NouveauCahierDesChargesNonChoisiError } from '../../../modules/demandeModification/demandeDélai/demander/NouveauCahierDesChargesNonChoisiError';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    dateAchevementDemandee: yup
      .date()
      .required(`Vous devez renseigner la date d'achèvement souhaitée.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date d'achèvement souhaitée saisie n'est pas valide`),
    justification: yup.string().optional(),
  }),
});

v1Router.post(
  routes.DEMANDE_DELAI_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.DEMANDER_DELAI(request.body.projectId), {
            ...omit(request.body, 'projectId'),
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      const {
        projectId,
        justification,
        dateAchevementDemandee: dateAchèvementDemandée,
      } = request.body;
      const { user } = request;

      const file = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };

      return demanderDélai({
        user,
        projectId,
        file,
        justification,
        dateAchèvementDemandée,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande de délai a bien été envoyée.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          );
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response });
          }

          if (
            error instanceof DemanderDateAchèvementAntérieureDateThéoriqueError ||
            error instanceof NouveauCahierDesChargesNonChoisiError
          ) {
            return errorResponse({
              request,
              response,
              customStatus: 400,
              customMessage: error.message,
            });
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
