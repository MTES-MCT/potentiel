import { IdentifiantProjet } from '@potentiel/domain-usecases';
import { Project } from '../../projectionsNext';
import { isSome } from '@potentiel/monads';

export const getLegacyIdByIdentifiantProjet = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet) => {
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
