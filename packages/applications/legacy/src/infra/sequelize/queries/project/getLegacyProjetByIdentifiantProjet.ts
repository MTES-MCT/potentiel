import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Project } from '../../projectionsNext';
import { PlainType } from '@potentiel-domain/core';
import { literal } from 'sequelize';

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

export const getLegacyProjetsIdsByIdentifiantsProjet = async (
  identifiants: PlainType<IdentifiantProjet.ValueType>[],
): Promise<string[]> => {
  try {
    if (identifiants.length === 0) return [];

    // Create composite keys for efficient comparison
    const compositeKeys = identifiants.map(
      ({ appelOffre, période, famille, numéroCRE }) =>
        `${appelOffre}|${période}|${famille || ''}|${numéroCRE}`,
    );

    const projets = await Project.findAll({
      where: literal(
        `CONCAT("appelOffreId", '|', "periodeId", '|', "familleId", '|', "numeroCRE") IN (${compositeKeys.map(() => '?').join(', ')})`,
      ),
      replacements: compositeKeys,
      attributes: ['id'],
    });

    return projets.map((projet) => projet.id);
  } catch (error) {
    throw new Error(error);
  }
};
