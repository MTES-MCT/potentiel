import { errAsync, wrapInfra } from '../../../../core/utils';
import { UserProjects, User, Project } from '../..';
import { GetProjectInfoForModificationReceivedNotification } from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
  (projectId: string) => {
    return wrapInfra(
      Project.findByPk(projectId, {
        attributes: [
          'nomProjet',
          'departementProjet',
          'regionProjet',
          'evaluationCarboneDeRéférence',
          'cahierDesChargesActuel',
          'puissanceInitiale',
          'technologie',
          'appelOffreId',
          'periodeId',
          'familleId',
        ],
      }),
    ).andThen((rawProject) => {
      if (!rawProject) {
        return errAsync(new EntityNotFoundError());
      }

      const {
        nomProjet,
        departementProjet,
        regionProjet,
        evaluationCarboneDeRéférence,
        puissanceInitiale,
        cahierDesChargesActuel,
        technologie,
        appelOffreId,
        periodeId,
        familleId,
      } = rawProject;

      return wrapInfra(
        UserProjects.findAll({
          attributes: ['projectId'],
          where: { projectId },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName', 'email', 'id'],
            },
          ],
        }),
      ).map((porteursProjets) => ({
        nomProjet,
        departementProjet,
        regionProjet,
        puissanceInitiale,
        cahierDesChargesActuel,
        evaluationCarboneDeRéférence,
        technologie: technologie && isTechnologie(technologie) ? technologie : ('N/A' as const),
        appelOffreId,
        periodeId,
        familleId,
        porteursProjet: porteursProjets.map(({ user: { id, email, fullName } }) => ({
          id,
          email,
          fullName,
        })),
      }));
    });
  };

function isTechnologie(technologie: string): technologie is AppelOffre.Technologie {
  return AppelOffre.technologies.includes(technologie as AppelOffre.Technologie);
}
