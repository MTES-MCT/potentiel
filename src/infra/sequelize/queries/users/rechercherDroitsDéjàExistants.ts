import { User, UserProjects } from '@infra/sequelize';

const rechercherDroitsDéjàExistants = async (email, projectId) => {
  const utilisateurExistant = await User.findOne({ where: { email }, attributes: ['id'] });
  if (!utilisateurExistant) {
    return;
  }
  const userProjects = await UserProjects.findOne({
    where: { userId: utilisateurExistant.id, projectId },
  });
  if (userProjects) {
  }
  return;
};
