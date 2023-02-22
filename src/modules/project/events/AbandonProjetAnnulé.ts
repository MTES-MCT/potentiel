import { DomainEvent, BaseDomainEvent } from '@core/domain';

type payload = {
  projetId: string;
  dateAchèvement: Date;
  dateLimiteEnvoiDcr?: Date;
};
export class AbandonProjetAnnulé extends BaseDomainEvent<payload> implements DomainEvent {
  public static type: 'AbandonProjetAnnulé' = 'AbandonProjetAnnulé';
  public type = AbandonProjetAnnulé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: payload) {
    return payload.projetId;
  }
}
