import asyncHandler from '../helpers/asyncHandler';
import { correctProjectData, ensureRole } from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { IllegalProjectDataError, CertificateFileIsMissingError } from '../../modules/project';
import routes from '../../routes';
import { errorResponse } from '../helpers';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { ProjetDéjàClasséError } from '../../modules/modificationRequest';

v1Router.post(
  routes.ADMIN_CORRECT_PROJECT_DATA_ACTION,
  upload.single('file'),
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    if (request.errorFileSizeLimit) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
          error: request.errorFileSizeLimit,
        }),
      );
    }

    if (request.body.numeroCRE || request.body.familleId || request.body.appelOffreAndPeriode) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
          error:
            'Vous tentez de changer une donnée non-modifiable, votre demande ne peut être prise en compte.',
          ...request.body,
        }),
      );
    }

    const { projectId, projectVersionDate, puissance } = request.body;

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      });
    }

    const result = await correctProjectData({
      projectId,
      projectVersionDate: new Date(Number(projectVersionDate)),
      correctedData: { puissance: Number(puissance) },
      user: request.user,
    });

    return result.match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Les données du projet ont bien été mises à jour.',
            redirectUrl: routes.PROJECT_DETAILS(projectId),
            redirectTitle: 'Retourner à la page projet',
          }),
        );
      },
      (e) => {
        if (e instanceof IllegalProjectDataError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error:
                "Votre demande n'a pas pu être prise en compte: " +
                Object.entries(e.errors)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(', '),
              ...request.body,
            }),
          );
        }

        if (e instanceof CertificateFileIsMissingError || e instanceof ProjetDéjàClasséError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: e.message,
              ...request.body,
            }),
          );
        }

        logger.error(e as Error);

        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: "Votre demande n'a pas pu être prise en compte.",
            ...request.body,
          }),
        );
      },
    );
  }),
);
