import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Project } from '../../projectionsNext';
import { PlainType } from '@potentiel-domain/core';

export const getLegacyProjetByIdentifiantProjet = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: PlainType<IdentifiantProjet.ValueType>): Promise<Project | null> => {
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
