import { ensureRole, getModificationRequestDetails } from '../../config';
import { logger } from '../../core/utils';
import { EntityNotFoundError } from '../../modules/shared';
import {
  DemandeAbandonPage,
  DemandeAnnulationAbandonPage,
  ModificationRequestPage,
} from '../../views';
import routes from '../../routes';
import { shouldUserAccessProject } from '../../config/useCases.config';
import {
  getIdentifiantProjetByLegacyId,
  getModificationRequestAuthority,
} from '../../infra/sequelize/queries';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { ModificationRequest } from '../../infra/sequelize/projectionsNext';
import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { isSome, Option, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre']),
  asyncHandler(async (request, response) => {
    const { user } = request;

    const legacyId = await getIdentifiantLegacyDemandeAbandon(request.params.modificationRequestId);

    if (isSome(legacyId)) {
      return response.redirect(routes.DEMANDE_PAGE_DETAILS(legacyId));
    }

    const { modificationRequestId } = request.params;

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const projectId = await _getProjectId(modificationRequestId);
    if (!projectId) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const result = await getIdentifiantProjetByLegacyId(projectId);

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

    let recandidature = false;

    try {
      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: result?.identifiantProjetValue || '',
        },
      });
      recandidature = abandon.demande.recandidature;
    } catch (e) {
      logger.error(e);
    }

    const authority = await getModificationRequestAuthority(modificationRequestId);

    const modificationRequestResult = await getModificationRequestDetails(modificationRequestId);

    return modificationRequestResult.match(
      (modificationRequest) => {
        if (modificationRequest.type === 'abandon') {
          return response.send(
            DemandeAbandonPage({
              request,
              demandeAbandon: { ...modificationRequest, recandidature },
            }),
          );
        }
        if (modificationRequest.type === 'annulation abandon') {
          return response.send(DemandeAnnulationAbandonPage({ request, modificationRequest }));
        }
        return response.send(ModificationRequestPage({ request, modificationRequest }));
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

const getIdentifiantLegacyDemandeAbandon = async (
  identifiantDemandeAbandon: string,
): Promise<Option<string>> => {
  const [appelOffre, période, famille, numéroCRE] = identifiantDemandeAbandon.split('#');

  const modificationRequest = await executeSelect<{ id: string }>(
    `select mr.id as "id"
     from "modificationRequests" mr 
     inner join "projects" p on mr."projectId" = p.id
     where mr.type = 'abandon'
     and   p."appelOffreId" = $1
     and   p."periodeId" = $2
     and   p."familleId" = $3
     and   p."numeroCRE" = $4
     order by mr."createdAt" desc`,
    appelOffre,
    période,
    isSome(famille) ? famille : '',
    numéroCRE,
  );

  return modificationRequest.length === 0 ? none : modificationRequest[0]?.id;
};

const _getProjectId = async (modificationRequestId) => {
  const rawModificationRequest = await ModificationRequest.findOne({
    where: {
      id: modificationRequestId,
    },
    attributes: ['projectId'],
  });

  return rawModificationRequest?.projectId;
};
