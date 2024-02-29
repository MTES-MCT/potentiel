import { IdentifiantProjet } from '@potentiel-domain/common';
import { Project } from '../../projectionsNext';
import { isSome } from '@potentiel/monads';

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
        familleId: isSome(famille) ? famille : '',
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
