import { ensureRole, requestActionnaireModification } from '../../config';
import { logger } from '../../core/utils';
import { PuissanceJustificationEtCourrierManquantError } from '../../modules/modificationRequest';
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '../../modules/shared';
import routes from '../../routes';
import { requestModification, shouldUserAccessProject } from '../../useCases';
import fs from 'fs';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { addQueryParams } from '../../helpers/addQueryParams';
import { pathExists } from '../../helpers/pathExists';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { Project } from '../../infra/sequelize/projectionsNext';
import { mediator } from 'mediateur';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

const routeRedirection = (type, projectId) => {
  let returnRoute: string;
  switch (type) {
    case 'actionnaire':
      returnRoute = routes.CHANGER_ACTIONNAIRE(projectId);
      break;
    case 'recours':
      returnRoute = routes.DEPOSER_RECOURS(projectId);
      break;
    default:
      returnRoute = routes.LISTE_PROJETS;
      break;
  }
  return returnRoute;
};

v1Router.post(
  routes.DEMANDE_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
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

    let file;

    if (request.file) {
      const dirExists: boolean = await pathExists(request.file.path);

      if (!dirExists) {
        const { projectId, type } = data;
        return response.redirect(
          addQueryParams(routeRedirection(type, projectId), {
            error: "Erreur: la pièce-jointe n'a pas pu être intégrée. Merci de réessayer.",
          }),
        );
      }

      file = {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };
    }

    const handleSuccess = () =>
      response.redirect(
        routes.SUCCESS_OR_ERROR_PAGE({
          success: 'Votre demande a bien été prise en compte.',
          redirectUrl: routes.PROJECT_DETAILS(projectId),
          redirectTitle: 'Retourner à la page projet',
        }),
      );

    const handleError = (error) => {
      const { projectId, type } = data;
      const redirectRoute = routeRedirection(type, projectId);

      if (error instanceof PuissanceJustificationEtCourrierManquantError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error: error.message,
          }),
        );
      }

      if (error instanceof AggregateHasBeenUpdatedSinceError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error:
              'Le projet a été modifié entre le moment où vous avez ouvert cette page et le moment où vous avez validé la demande. Merci de prendre en compte le changement et refaire votre demande si nécessaire.',
          }),
        );
      }

      if (error instanceof EntityNotFoundError) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      } else if (error instanceof UnauthorizedError) {
        return unauthorizedResponse({ request, response });
      }

      logger.error(error);

      return errorResponse({ request, response });
    };

    switch (data.type) {
      case 'actionnaire':
        const project = await Project.findByPk(data.projectId);
        if (!project) {
          return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
        }

        const { appelOffreId, periodeId, familleId, numeroCRE } = project;
        const détailAppelOffre = await mediator.send<ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: { identifiantAppelOffre: appelOffreId },
        });

        const soumisAuxGarantiesFinancières = familleId
          ? détailAppelOffre.familles.find((f) => f.id === familleId)?.soumisAuxGarantiesFinancieres
          : détailAppelOffre.soumisAuxGarantiesFinancieres;

        if (soumisAuxGarantiesFinancières === 'après candidature') {
          try {
            const garantiesFinancières =
              await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
                type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
                data: {
                  identifiantProjetValue: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
                },
              });

            await requestActionnaireModification({
              projectId: data.projectId,
              requestedBy: request.user,
              newActionnaire: data.actionnaire,
              justification: data.justification,
              file,
              soumisAuxGarantiesFinancières: 'après candidature',
              ...(garantiesFinancières.actuelles ||
                (garantiesFinancières.dépôts.length && {
                  garantiesFinancièresConstituées: true,
                })),
            });
          } catch (error) {
            if (error instanceof AggregateHasBeenUpdatedSinceError) {
              return response.redirect(
                addQueryParams(routes.CHANGER_ACTIONNAIRE(projectId), {
                  ...omit(data, 'projectId'),
                  error:
                    'Le projet a été modifié entre le moment où vous avez ouvert cette page et le moment où vous avez validé la demande. Merci de prendre en compte le changement et refaire votre demande si nécessaire.',
                }),
              );
            }
            return requestActionnaireModification({
              projectId: data.projectId,
              requestedBy: request.user,
              newActionnaire: data.actionnaire,
              justification: data.justification,
              file,
              soumisAuxGarantiesFinancières: 'après candidature',
            }).match(handleSuccess, handleError);
          }

          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande a bien été prise en compte.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            }),
          );
        }

        await requestActionnaireModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newActionnaire: data.actionnaire,
          justification: data.justification,
          file,
          soumisAuxGarantiesFinancières: soumisAuxGarantiesFinancières ?? 'non soumis',
        }).match(handleSuccess, handleError);

        break;
      default:
        await requestModification({
          ...data,
          file,
          user: request.user,
        }).match(handleSuccess, handleError);
        break;
    }
  }),
);
