import { logger } from '@core/utils';
import { GestionnaireRéseauAjouté } from '@modules/gestionnaireRéseau';
import { ProjectionEnEchec } from '@modules/shared';
import {
  GestionnairesRéseauListe,
  GestionnairesRéseauListeProjector,
} from '../gestionnairesRéseauListe.model';

export default GestionnairesRéseauListeProjector.on(
  GestionnaireRéseauAjouté,
  async (évènement, transaction) => {
    const {
      payload: { codeEIC, raisonSociale },
    } = évènement;
    try {
      await GestionnairesRéseauListe.create(
        {
          codeEIC,
          raisonSociale,
        },
        { transaction },
      );
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement GestionnaireRéseauAjouté`,
          {
            évènement,
            nomProjection: 'GestionnairesRéseauListe.GestionnaireRéseauAjouté',
          },
          error,
        ),
      );
    }
  },
);
