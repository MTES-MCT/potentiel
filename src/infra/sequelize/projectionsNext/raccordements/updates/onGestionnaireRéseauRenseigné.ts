import { Raccordements, RaccordementsProjector } from '../raccordements.model';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { GestionnaireRéseauRenseigné } from '@modules/project';

export default RaccordementsProjector.on(
  GestionnaireRéseauRenseigné,
  async (évènement, transaction) => {
    const {
      payload: { projectId, codeEIC },
    } = évènement;
    try {
      await Raccordements.update(
        {
          codeEICGestionnaireRéseau: codeEIC,
        },
        { where: { projetId: projectId }, transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement GestionnaireRéseauRenseigné`,
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
