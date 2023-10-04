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
import { ConsulterAbandonQuery } from '@potentiel/domain-views';
import {
  IdentifiantProjet,
  RawIdentifiantDemandeAbandon,
  convertirEnIdentifiantDemandeAbandon,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantDemandeAbandon,
} from '@potentiel/domain';
import { isSome, Option, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre']),
  asyncHandler(async (request, response) => {
    const { user } = request;

    if (estUnRawIdentifiantDemandeAbandon(request.params.modificationRequestId)) {
      const modificationRequestId = await getIdentifiantLegacyDemandeAbandon(
        request.params.modificationRequestId,
      );

      if (isSome(modificationRequestId)) {
        return response.redirect(routes.DEMANDE_PAGE_DETAILS(modificationRequestId));
      }

      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const { modificationRequestId } = request.params;

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const projectId = await _getProjectId(modificationRequestId);
    if (!projectId) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const identifiantProjet = (await getIdentifiantProjetByLegacyId(
      projectId,
    )) as IdentifiantProjet;

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

    const abandon = await mediator.send<ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
      },
    });

    const recandidature = isSome(abandon) ? abandon.demandeRecandidature : false;

    const authority = await getModificationRequestAuthority(modificationRequestId);

    const modificationRequestResult = await getModificationRequestDetails(modificationRequestId);

    return modificationRequestResult.match(
      (modificationRequest) => {
        if (
          user?.role === 'dreal' &&
          authority !== 'dreal' &&
          modificationRequest.type !== 'abandon'
        ) {
          return unauthorizedResponse({ request, response });
        }

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
  identifiantDemandeAbandon: RawIdentifiantDemandeAbandon,
): Promise<Option<string>> => {
  const { typeDemande, appelOffre, période, famille, numéroCRE } =
    convertirEnIdentifiantDemandeAbandon(identifiantDemandeAbandon);

  const modificationRequest = await executeSelect<{ id: string }>(
    `select mr.id as "id"
     from "modificationRequests" mr 
     inner join "projects" p on mr."projectId" = p.id
     where mr.type = $1
     and   p."appelOffreId" = $2
     and   p."periodeId" = $3
     and   p."familleId" = $4
     and   p."numeroCRE" = $5
     order by mr."createdAt" desc`,
    typeDemande,
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
