import { ensureRole, getProjectAppelOffre } from '@config';
import { shouldUserAccessProject } from '@config/useCases.config';

import routes from '@routes';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import { notFoundResponse, unauthorizedResponse } from '../../helpers';
import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';

import { ChangerFournisseurPage } from '@views';
import { Project } from '../../../infra/sequelize/projectionsNext';

v1Router.get(
  routes.CHANGER_FOURNISSEUR(),
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    const {
      user,
      params: { projectId },
    } = request;

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    // TODO: lecture faite directement sur la table Project sans passé par une query...
    const project = await Project.findByPk(projectId);

    if (!project) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId,
    });

    if (!userHasRightsToProject) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Votre compte ne vous permet pas d'accéder à cette page.`,
      });
    }

    const { appelOffreId, periodeId, familleId } = project;
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });
    if (!appelOffre) {
      return notFoundResponse({ request, response, ressourceTitle: 'AppelOffre' });
    }

    return response.send(
      ChangerFournisseurPage({
        request,
        project: { ...project.get(), unitePuissance: appelOffre.unitePuissance },
        appelOffre,
      }),
    );
  }),
);
