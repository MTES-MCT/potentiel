import { errAsync, wrapInfra } from '@core/utils';
import { UserProjects, User, Project } from '@infra/sequelize';
import { GetProjectInfoForModificationRequestedNotification } from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';

export const getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification =
  (projectId: string) => {
    return wrapInfra(
      Project.findByPk(projectId, {
        attributes: ['nomProjet', 'departementProjet', 'regionProjet'],
      }),
    ).andThen((rawProject) => {
      if (!rawProject) {
        return errAsync(new EntityNotFoundError());
      }

      const { nomProjet, departementProjet, regionProjet } = rawProject;

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
        porteursProjet: porteursProjets.map(({ user: { id, email, fullName } }) => ({
          id,
          email,
          fullName,
        })),
      }));
    });
  };
