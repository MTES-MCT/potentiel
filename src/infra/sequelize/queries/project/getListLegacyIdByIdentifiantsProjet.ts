import { IdentifiantProjet } from '@potentiel/domain';
import { isSome } from '@potentiel/monads';
import { Project } from '../../projectionsNext';
import { Op } from 'sequelize';

export const getListLegacyIdByIdentifiantsProjes = async (
  identifiantsProjet: IdentifiantProjet[],
) => {
  if (!identifiantsProjet) {
    return [];
  }

  const projets: { id: Project['id'] }[] = await Project.findAll({
    where: {
      [Op.or]: identifiantsProjet.map((identifiantProjet) => ({
        appelOffreId: identifiantProjet.appelOffre,
        periodeId: identifiantProjet.période,
        familleId: isSome(identifiantProjet.famille) ? identifiantProjet.famille : '',
        numeroCRE: identifiantProjet.numéroCRE,
      })),
    },
    raw: true,
    attributes: ['id'],
  });

  return projets.map((p) => p.id);
};
