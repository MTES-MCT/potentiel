import { IdentifiantProjet } from '@potentiel-domain/common';
import { Project } from '../../projectionsNext';

export const getLegacyIdByIdentifiantProjet = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: Pick<IdentifiantProjet.ValueType, 'appelOffre' | 'famille' | 'numéroCRE' | 'période'>) => {
  try {
    const projet = await Project.findOne({
      where: {
        appelOffreId: appelOffre,
        periodeId: période,
        familleId: famille ? famille : '',
        numeroCRE: numéroCRE,
      },
      attributes: ['id'],
      raw: true,
    });

    return projet?.id || null;
  } catch (error) {
    throw new Error(error);
  }
};
