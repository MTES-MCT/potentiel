import { Raccordements, RaccordementsProjector } from '../raccordements.model';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectDCRSubmitted } from '@modules/project';

export default RaccordementsProjector.on(ProjectDCRSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, numeroDossier },
  } = évènement;

  try {
    await Raccordements.update(
      {
        identifiantGestionnaire: numeroDossier,
      },
      { where: { projetId: projectId }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectDCRSubmitted`,
        {
          évènement,
          nomProjection: 'raccordements',
        },
        error,
      ),
    );
  }
});
