import { BaseDomainEvent, DomainEvent } from '@core/domain';
export type Payload = {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
};

export class GestionnaireRéseauAjouté extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'GestionnaireRéseauAjouté' = 'GestionnaireRéseauAjouté';
  public type = GestionnaireRéseauAjouté.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.codeEIC;
  }
}
