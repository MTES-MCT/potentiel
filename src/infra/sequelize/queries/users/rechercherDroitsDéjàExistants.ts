import { User, UserProjects } from '@infra/sequelize';
import { RechercherDroitsDéjàExistantsQueryHandler } from '@modules/utilisateur/inviterPorteurSurDesProjets/rechercherDroitsDéjàExistants';

export const rechercherDroitsDéjàExistantsQueryHandler: RechercherDroitsDéjàExistantsQueryHandler =
  async ({ email, projectIds }) => {
    const projetsDéjàRattachésUser: string[] = [];

    const utilisateurExistant = await User.findOne({ where: { email }, attributes: ['id'] });

    if (!utilisateurExistant) {
      return projetsDéjàRattachésUser;
    }

    for (const projectId of projectIds) {
      const userProject = await UserProjects.findOne({
        where: { userId: utilisateurExistant.id, projectId },
        attributes: ['projectId'],
      });

      if (userProject) {
        projetsDéjàRattachésUser.push(userProject.projectId);
      }
    }

    return projetsDéjàRattachésUser;
  };
