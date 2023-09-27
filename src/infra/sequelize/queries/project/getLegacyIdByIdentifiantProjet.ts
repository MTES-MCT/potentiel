import { IdentifiantProjet } from '@potentiel/domain';
import { Project } from '../../projectionsNext';
import { isSome } from '@potentiel/monads';

export const getLegacyIdByIdentifiantProjet = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet) => {
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
};
