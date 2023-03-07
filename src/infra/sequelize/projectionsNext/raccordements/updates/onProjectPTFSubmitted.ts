import { ProjectPTFSubmitted } from '@modules/project';
import { Raccordements } from '../raccordements.model';
import { RaccordementsProjector } from '../raccordements.projector';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export default RaccordementsProjector.on(ProjectPTFSubmitted, async (évènement, transaction) => {
  const {
    payload: { projectId, fileId, submittedBy, ptfDate },
  } = évènement;

  try {
    await Raccordements.update(
      {
        ptfFichierId: fileId,
        ptfDateDeSignature: ptfDate,
        ptfEnvoyéePar: submittedBy,
      },
      { where: { projetId: projectId }, transaction },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectPTFSubmitted`,
        {
          évènement,
          nomProjection: 'Raccordements',
        },
        error,
      ),
    );
  }
});
