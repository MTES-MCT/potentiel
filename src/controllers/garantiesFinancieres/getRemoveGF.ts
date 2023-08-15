import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '../../routes';
import { removeGF } from '../../config/useCases.config';
import { UnauthorizedError } from '../../modules/shared';
import { PermissionAnnulerGF } from '../../modules/project/useCases';
import { v1Router } from '../v1Router';
import asyncHandler from '../helpers/asyncHandler';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import {
  NoGFCertificateToDeleteError,
  SuppressionGFValidéeImpossibleError,
} from '../../modules/project/errors';

v1Router.get(
  routes.REMOVE_GARANTIES_FINANCIERES(),
  vérifierPermissionUtilisateur(PermissionAnnulerGF),
  asyncHandler(async (request, response) => {
    const { user } = request;
    const { projectId } = request.params;

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    (
      await removeGF({
        removedBy: user,
        projectId,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: "Le dépôt de l'attestation de garanties financières a été annulé avec succès.",
          }),
        ),
      (e) => {
        if (
          e instanceof SuppressionGFValidéeImpossibleError ||
          e instanceof NoGFCertificateToDeleteError
        ) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: e.message,
            }),
          );
        }

        if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response });
        }

        logger.error(e);
        return errorResponse({ request, response });
      },
    );
  }),
);
