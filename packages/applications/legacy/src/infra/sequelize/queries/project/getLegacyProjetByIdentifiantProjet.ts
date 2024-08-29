import { IdentifiantProjet } from '@potentiel-domain/common';
import { Project } from '../../projectionsNext';

export const getLegacyProjetByIdentifiantProjet = async ({
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
      raw: true,
    });

    if (!projet) return null;
    return projet;
  } catch (error) {
    throw new Error(error);
  }
};
