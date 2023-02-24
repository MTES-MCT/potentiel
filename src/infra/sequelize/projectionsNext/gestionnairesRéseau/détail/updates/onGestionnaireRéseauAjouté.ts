import { logger } from '@core/utils';
import { GestionnaireRéseauAjouté } from '@modules/gestionnaireRéseau';
import { ProjectionEnEchec } from '@modules/shared';
import {
  GestionnaireRéseauDétail,
  GestionnaireRéseauDétailProjector,
} from '../gestionnairesRéseauDétail.model';

export default GestionnaireRéseauDétailProjector.on(
  GestionnaireRéseauAjouté,
  async (évènement, transaction) => {
    const { payload } = évènement;
    try {
      await GestionnaireRéseauDétail.create(payload, { transaction });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement GestionnaireRéseauAjouté`,
          {
            évènement,
            nomProjection: 'GestionnaireRéseauDétail.GestionnaireRéseauAjouté',
          },
          error,
        ),
      );
    }
  },
);
