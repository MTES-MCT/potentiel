import { ensureRole, getProjectAppelOffre, shouldUserAccessProject } from '../../../config';

import routes from '../../../routes';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import { notFoundResponse, unauthorizedResponse } from '../../helpers';
import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';

import { DemanderDelaiPage } from '../../../views';
import { Project } from '../../../infra/sequelize/projectionsNext';
import { CahierDesCharges, Candidature } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

v1Router.get(
  routes.DEMANDER_DELAI(),
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const {
      user,
      params: { projectId },
    } = request;

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    // TODO: lecture faite directement sur la table Project sans passer par une query...
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

    const référenceCdcActuel = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
      project.cahierDesChargesActuel,
    );
    const cahierDesCharges = CahierDesCharges.bind({
      appelOffre,
      période: appelOffre.periode,
      famille: undefined,
      cahierDesChargesModificatif: appelOffre.periode.cahiersDesChargesModifiésDisponibles.find(
        (cdc) => AppelOffre.RéférenceCahierDesCharges.bind(cdc).estÉgaleÀ(référenceCdcActuel),
      ),
      technologie: project.technologie,
    });

    if (cahierDesCharges.doitChoisirUnCahierDesChargesModificatif()) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Vous devez d'abord choisir un nouveau cahier des charges.`,
      });
    }

    return response.send(
      DemanderDelaiPage({
        request,
        project: {
          ...project.get(),
          unitePuissance: Candidature.UnitéPuissance.déterminer({
            appelOffres: appelOffre,
            période: periodeId,
            technologie: project.technologie ?? 'N/A',
          }).formatter(),
          cahiersDesChargesUrl: appelOffre.cahiersDesChargesUrl,
        },
        appelOffre,
      }),
    );
  }),
);
