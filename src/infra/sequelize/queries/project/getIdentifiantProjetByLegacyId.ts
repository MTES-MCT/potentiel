import { Project } from '../../projectionsNext';

export const getIdentifiantProjetByLegacyId = async (legacyId: Project['id']) => {
  try {
    const projet = await Project.findByPk(legacyId, {
      attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
      raw: true,
    });

    if (!projet) {
      return null;
    }

    return {
      appelOffre: projet.appelOffreId,
      période: projet.periodeId,
      famille: projet.familleId,
      numéroCRE: projet.numeroCRE,
    };
  } catch (error) {
    throw new Error(error);
  }
};
