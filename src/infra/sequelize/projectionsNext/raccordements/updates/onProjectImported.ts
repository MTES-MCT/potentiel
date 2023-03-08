import { UniqueEntityID } from '@core/domain';
import { logger } from '@core/utils';
import { ProjectImported } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';
import { Raccordements } from '../raccordements.model';
import { RaccordementsProjector } from '../raccordements.projector';

export default RaccordementsProjector.on(ProjectImported, async (évènement, transaction) => {
  const {
    payload: { projectId: projetId },
  } = évènement;

  const entréeExistance = await Raccordements.findOne({ where: { projetId }, transaction });

  if (entréeExistance) {
    return;
  }

  try {
    await Raccordements.create(
      {
        id: new UniqueEntityID().toString(),
        projetId,
      },
      { transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectImported`,
        {
          évènement,
          nomProjection: 'Raccordements',
        },
        error,
      ),
    );
  }
});
