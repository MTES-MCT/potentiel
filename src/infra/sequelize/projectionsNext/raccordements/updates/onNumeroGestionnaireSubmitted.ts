import { Raccordements } from '../raccordements.model';
import { RaccordementsProjector } from '../raccordements.projector';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { NumeroGestionnaireSubmitted } from '@modules/project';

export default RaccordementsProjector.on(
  NumeroGestionnaireSubmitted,
  async (évènement, transaction) => {
    const {
      payload: { projectId, numeroGestionnaire },
    } = évènement;
    try {
      await Raccordements.update(
        {
          identifiantGestionnaire: numeroGestionnaire,
        },
        { where: { projetId: projectId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement NumeroGestionnaireSubmitted`,
          {
            évènement,
            nomProjection: 'Raccordements',
          },
          error,
        ),
      );
    }
  },
);
