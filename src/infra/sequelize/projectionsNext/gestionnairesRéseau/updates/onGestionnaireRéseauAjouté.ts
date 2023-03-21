import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { GestionnaireRéseau } from '../gestionnairesRéseau.model';
import { GestionnaireRéseauProjector } from '../gestionnaireRéseau.projector';
import { GestionnaireRéseauAjouté } from './gestionnaireRéseauAjouté.deprecated';

export default GestionnaireRéseauProjector.on(
  GestionnaireRéseauAjouté,
  async (évènement, transaction) => {
    const {
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: { format, légende },
      },
    } = évènement;
    try {
      await GestionnaireRéseau.create({ codeEIC, format, légende, raisonSociale }, { transaction });
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
