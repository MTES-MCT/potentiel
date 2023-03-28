import { User, UserProjects } from '@infra/sequelize';
import { RechercherDroitsDéjàExistantsQueryHandler } from '@modules/utilisateur/inviterPorteurSurDesProjets/rechercherDroitsDéjàExistants';

export const rechercherDroitsDéjàExistantsQueryHandler: RechercherDroitsDéjàExistantsQueryHandler =
  async ({ email, projectIds }) => {
    const utilisateurExistant = await User.findOne({ where: { email }, attributes: ['id'] });
    const projetsDéjàRattachésUser: string[] = [];

    if (!utilisateurExistant) {
      return projetsDéjàRattachésUser;
    }

    for (const projectId of projectIds) {
      try {
        const userProject = await UserProjects.findOne({
          where: { userId: utilisateurExistant.id, projectId },
        });

        if (userProject) {
          projetsDéjàRattachésUser.push(userProject.projectId);
        }
      } catch (e) {
        console.error(e);
      }
    }

    return projetsDéjàRattachésUser;
  };
