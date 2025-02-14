import { ensureRole } from '../../config';
import routes from '../../routes';
import { shouldUserAccessProject } from '../../useCases';
import pick from 'lodash/pick';
import { addQueryParams } from '../../helpers/addQueryParams';
import { pathExists } from '../../helpers/pathExists';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { upload } from '../upload';
import { v1Router } from '../v1Router';

v1Router.post(
  routes.DEMANDE_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    if (request.errorFileSizeLimit) {
      return response.redirect(
        addQueryParams(routes.LISTE_PROJETS, {
          error: request.errorFileSizeLimit,
        }),
      );
    }

    const { projectId } = request.body;

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const userAccess = await shouldUserAccessProject({
      projectId,
      user: request.user,
    });

    if (!userAccess) {
      return unauthorizedResponse({ request, response });
    }

    const data = pick(request.body, [
      'type',
      'actionnaire',
      'justification',
      'projectId',
      'numeroGestionnaire',
      'evaluationCarbone',
    ]);

    data.evaluationCarbone = data.evaluationCarbone ? Number(data.evaluationCarbone) : undefined;

    if (request.file) {
      const dirExists: boolean = await pathExists(request.file.path);

      if (!dirExists) {
        return response.redirect(
          addQueryParams(routes.LISTE_PROJETS, {
            error: "Erreur: la pièce-jointe n'a pas pu être intégrée. Merci de réessayer.",
          }),
        );
      }
    }
  }),
);
