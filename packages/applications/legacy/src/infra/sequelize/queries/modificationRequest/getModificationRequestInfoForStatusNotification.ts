import { errAsync, wrapInfra } from '../../../../core/utils';
import { UserProjects, User, ModificationRequest, Project } from '../..';
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestInfoForStatusNotificationDTO,
} from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';

export const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
  (modificationRequestId: string) => {
    return wrapInfra(
      ModificationRequest.findByPk(modificationRequestId, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: [
              'nomProjet',
              'departementProjet',
              'regionProjet',
              'appelOffreId',
              'periodeId',
            ],
          },
        ],
      }),
    ).andThen((modificationRequestRaw) => {
      if (!modificationRequestRaw) {
        return errAsync(new EntityNotFoundError());
      }

      const {
        type,
        projectId,
        authority,
        project: { nomProjet, departementProjet, regionProjet, appelOffreId, periodeId },
      } = modificationRequestRaw;

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
      ).map(
        (porteursProjets): ModificationRequestInfoForStatusNotificationDTO => ({
          type,
          nomProjet,
          departementProjet,
          regionProjet,
          appelOffreId,
          périodeId: periodeId,
          autorité: authority === 'dreal' ? 'dreal' : 'dgec',
          porteursProjet: porteursProjets.map(({ user: { id, email, fullName } }) => ({
            id,
            email,
            fullName,
          })),
        }),
      );
    });
  };
