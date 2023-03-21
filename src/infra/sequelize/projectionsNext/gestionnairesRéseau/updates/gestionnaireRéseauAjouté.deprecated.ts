import { BaseDomainEvent, DomainEvent } from '@core/domain';

/**
 * @deprecated do not use this event, we gonna delete it soon. It's here only for compatibility with the DomainEvent classes !!!
 */

export class GestionnaireRéseauAjouté
  extends BaseDomainEvent<{
    streamId: string;
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
    streamId: string;
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
  }) {
    return payload.streamId;
  }
}
