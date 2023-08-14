import { errAsync, wrapInfra } from '../../../../core/utils';
import { UserProjects, User, Project } from "../..";
import { GetProjectInfoForModificationReceivedNotification } from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';

export const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
  (projectId: string) => {
    return wrapInfra(
      Project.findByPk(projectId, {
        attributes: [
          'nomProjet',
          'departementProjet',
          'regionProjet',
          'evaluationCarboneDeRéférence',
        ],
      }),
    ).andThen((rawProject) => {
      if (!rawProject) {
        return errAsync(new EntityNotFoundError());
      }

      const { nomProjet, departementProjet, regionProjet, evaluationCarboneDeRéférence } =
        rawProject;

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
        evaluationCarboneDeRéférence,
        porteursProjet: porteursProjets.map(({ user: { id, email, fullName } }) => ({
          id,
          email,
          fullName,
        })),
      }));
    });
  };
