import { BaseDomainEvent, DomainEvent } from '@core/domain';

export interface ToutAccèsAuProjetRevoquéPayload {
  projetId: string;
  cause?: 'changement producteur';
}
export class ToutAccèsAuProjetRevoqué
  extends BaseDomainEvent<ToutAccèsAuProjetRevoquéPayload>
  implements DomainEvent
{
  public static type: 'ToutAccèsAuProjetRevoqué' = 'ToutAccèsAuProjetRevoqué';
  public type = ToutAccèsAuProjetRevoqué.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ToutAccèsAuProjetRevoquéPayload) {
    return payload.projetId;
  }
}
