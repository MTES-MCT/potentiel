import { GestionnaireRéseau } from '../gestionnairesRéseau.model';
import { GestionnaireRéseauProjector } from '../gestionnaireRéseau.projector';
import { BaseDomainEvent, DomainEvent } from '@core/domain';

/**
 * @deprecated do not use this event, we gonna delete it soon. It's here only for compatibility with the DomainEvent classes !!!
 */
export class GestionnaireRéseauModifié
  extends BaseDomainEvent<{
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }>
  implements DomainEvent
{
  public static type: 'GestionnaireRéseauModifié' = 'GestionnaireRéseauModifié';
  public type = GestionnaireRéseauModifié.type;
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
  GestionnaireRéseauModifié,
  async (évènement, transaction) => {
    const {
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: { format, légende },
      },
    } = évènement;
    await GestionnaireRéseau.update(
      { format, légende, raisonSociale },
      {
        where: {
          codeEIC,
        },
        transaction,
      },
    );
  },
);
