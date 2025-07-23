import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Project } from '../../projectionsNext';
import { Op } from 'sequelize';

export const getListIdentifiantsProjetByLegacyIds = async (legacyIds: Array<Project['id']>) => {
  if (!legacyIds || !legacyIds.length) {
    return [];
  }

  try {
    const projets = await Project.findAll({
      where: {
        id: { [Op.in]: legacyIds },
      },
      raw: true,
      attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
    });

    const identifiantsProjet: Pick<
      IdentifiantProjet.ValueType,
      'appelOffre' | 'famille' | 'numéroCRE' | 'période'
    >[] = projets.map((p) => ({
      appelOffre: p.appelOffreId,
      période: p.periodeId,
      famille: p.familleId,
      numéroCRE: p.numeroCRE,
    }));

    return identifiantsProjet;
  } catch (error) {
    throw new Error(error);
  }
};
