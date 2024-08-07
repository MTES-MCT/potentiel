import { ensureRole, loadFileForUser } from '../../config';
import { UniqueEntityID } from '../../core/domain';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { Project } from '../../infra/sequelize/projectionsNext';
import { FileAccessDeniedError, FileNotFoundError } from '../../modules/file';
import { InfraNotAvailableError } from '../../modules/shared';
import routes from '../../routes';
import {
  errorResponse,
  miseAJourStatistiquesUtilisation,
  notFoundResponse,
  unauthorizedResponse,
} from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';

v1Router.get(
  routes.DOWNLOAD_CERTIFICATE_FILE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre']),
  asyncHandler(async (request, response) => {
    const { projectId, fileId } = request.params;
    const { user } = request;

    if (!validateUniqueId(fileId) || !validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Fichier' });
    }

    await loadFileForUser({
      fileId: new UniqueEntityID(fileId),
      user,
    }).match(
      async (fileStream) => {
        if (user.role === 'porteur-projet') {
          const projet = await Project.findOne({
            where: { id: projectId },
            attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
          });

          if (projet) {
            miseAJourStatistiquesUtilisation({
              type: 'attestationTéléchargée',
              données: {
                utilisateur: {
                  role: 'porteur-projet',
                },
                projet: {
                  appelOffreId: projet.appelOffreId,
                  periodeId: projet.periodeId,
                  familleId: projet.familleId,
                  numeroCRE: projet.numeroCRE,
                },
              },
            });
          }
        }

        response.type('pdf');
        fileStream.contents.pipe(response);
        return response.status(200);
      },
      async (e) => {
        if (e instanceof FileNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Fichier' });
        } else if (e instanceof FileAccessDeniedError) {
          return unauthorizedResponse({ request, response });
        } else if (e instanceof InfraNotAvailableError) {
          return errorResponse({ request, response });
        }
      },
    );
  }),
);
