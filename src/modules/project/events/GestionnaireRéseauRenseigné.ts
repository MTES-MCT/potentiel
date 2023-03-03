import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain';

type payload = {
  projectId: string;
  submittedBy: string;
  codeEIC: string;
};
export class GestionnaireRéseauRenseigné extends BaseDomainEvent<payload> implements DomainEvent {
  public static type: 'GestionnaireRéseauRenseigné' = 'GestionnaireRéseauRenseigné';
  public type = GestionnaireRéseauRenseigné.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<payload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: payload) {
    return payload.projectId;
  }
}
