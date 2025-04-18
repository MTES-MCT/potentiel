import { ensureRole, getModificationRequestDetails } from '../../../config';
import { logger } from '../../../core/utils';
import { EntityNotFoundError } from '../../../modules/shared';
import { CorrigerDelaiAccordePage } from '../../../views';
import routes from '../../../routes';
import { shouldUserAccessProject } from '../../../config/useCases.config';
import {
  getIdentifiantProjetByLegacyId,
  getModificationRequestAuthority,
} from '../../../infra/sequelize/queries';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers';
import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import { ModificationRequest, Project } from '../../../infra/sequelize/projectionsNext';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { getDelaiDeRealisation } from '../../../modules/projectAppelOffre';
import { add, sub } from 'date-fns';
import { addQueryParams } from '../../../helpers/addQueryParams';
import { Option } from '@potentiel-libraries/monads';

v1Router.get(
  routes.GET_CORRIGER_DELAI_ACCORDE_PAGE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const {
      user,
      params: { demandeDelaiId },
      query: { error },
    } = request;

    if (!validateUniqueId(demandeDelaiId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const projectId = await _getProjectId(demandeDelaiId);
    if (!projectId) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
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

    const authority = await getModificationRequestAuthority(demandeDelaiId);

    if (user?.role === 'dreal' && authority !== 'dreal') {
      return unauthorizedResponse({ request, response });
    }

    const identifiantProjet = await getIdentifiantProjetByLegacyId(projectId);

    if (!identifiantProjet) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const résuméProjet = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: { identifiantProjet: identifiantProjet.identifiantProjetValue },
    });

    if (Option.isNone(résuméProjet)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    if (résuméProjet.statut !== 'classé') {
      return response.redirect(
        addQueryParams(routes.GET_DETAILS_DEMANDE_DELAI_PAGE(request.body.demandeDelaiId), {
          error:
            'Vous ne pouvez pas corriger ce délai accordé car le projet doit être lauréat et actif.',
        }),
      );
    }

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: résuméProjet.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const delaiRealisationEnMois = getDelaiDeRealisation(appelOffre, résuméProjet.technologie);

    if (!delaiRealisationEnMois) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const dateAchèvementInitiale = sub(
      add(new Date(résuméProjet.dateDésignation), {
        months: delaiRealisationEnMois,
      }),
      {
        days: 1,
      },
    ).getTime();

    const dateAchèvementActuelle = await Project.findOne({
      where: { id: projectId },
      attributes: ['completionDueOn'],
    });

    if (!dateAchèvementActuelle) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const modificationRequestResult = await getModificationRequestDetails(demandeDelaiId);

    return modificationRequestResult.match(
      (modificationRequest) => {
        if (modificationRequest.type !== 'delai') {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }
        return response.send(
          CorrigerDelaiAccordePage({
            demandeDélai: modificationRequest,
            résuméProjet,
            utilisateur: user,
            dateAchèvementInitiale: new Date(dateAchèvementInitiale).toISOString(),
            dateAchèvementActuelle: new Date(
              dateAchèvementActuelle.dataValues.completionDueOn,
            ).toISOString(),
            error: error as string,
          }),
        );
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }

        logger.error(e);
        return errorResponse({ request, response });
      },
    );
  }),
);

const _getProjectId = async (modificationRequestId) => {
  const rawModificationRequest = await ModificationRequest.findOne({
    where: {
      id: modificationRequestId,
    },
    attributes: ['projectId'],
  });

  return rawModificationRequest?.projectId;
};
