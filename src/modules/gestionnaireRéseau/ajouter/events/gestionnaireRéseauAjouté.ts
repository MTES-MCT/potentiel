import { BaseDomainEvent, DomainEvent } from '@core/domain';
export type payload = {
  id: string;
  format?: string;
  légende?: string;
};

export class GestionnaireRéseauAjouté extends BaseDomainEvent<payload> implements DomainEvent {
  public static type: 'GestionnaireRéseauAjouté' = 'GestionnaireRéseauAjouté';
  public type = GestionnaireRéseauAjouté.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: payload) {
    return payload.id;
  }
}
