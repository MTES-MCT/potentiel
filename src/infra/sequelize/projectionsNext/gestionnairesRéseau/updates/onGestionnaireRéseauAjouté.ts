import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { GestionnaireRéseau } from '../gestionnairesRéseau.model';
import { GestionnaireRéseauProjector } from '../gestionnaireRéseau.projector';
import { BaseDomainEvent, DomainEvent } from '@core/domain';

/**
 * @deprecated do not use this event, we gonna delete it soon. It's here only for compatibility with the DomainEvent classes !!!
 */
export class GestionnaireRéseauAjouté
  extends BaseDomainEvent<{
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }>
  implements DomainEvent
{
  public static type: 'GestionnaireRéseauAjouté' = 'GestionnaireRéseauAjouté';
  public type = GestionnaireRéseauAjouté.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }) {
    return payload.codeEIC;
  }
}

export default GestionnaireRéseauProjector.on(
  GestionnaireRéseauAjouté,
  async (évènement, transaction) => {
    const { payload } = évènement;
    try {
      await GestionnaireRéseau.create(payload, { transaction });
    } catch (error) {
      console.error(error);
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
