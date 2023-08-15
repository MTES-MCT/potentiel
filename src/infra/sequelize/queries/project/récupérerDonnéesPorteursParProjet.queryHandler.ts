import { User, UserProjects } from "../../projectionsNext";
import { RécupérerDonnéesPorteursParProjetQueryHandler } from '../../../../modules/project/queries';

export const récupérerDonnéesPorteursParProjetQueryHandler: RécupérerDonnéesPorteursParProjetQueryHandler =
  async ({ projetId }) => {
    const rawData = await UserProjects.findAll({
      attributes: ['projectId'],
      where: { projectId: projetId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'id', 'role'],
          where: { role: 'porteur-projet' },
        },
      ],
    });

    return rawData.map(({ user: { fullName, email, role, id } }) => ({
      fullName,
      email,
      role,
      id,
    }));
  };
