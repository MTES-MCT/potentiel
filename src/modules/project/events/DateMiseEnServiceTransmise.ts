import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain';

export interface Payload {
  dateMiseEnService: string;
  référenceDossierRaccordement: string;
  identifiantProjet: string;
}
export class DateMiseEnServiceTransmise extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'DateMiseEnServiceTransmise' = 'DateMiseEnServiceTransmise';
  public type = DateMiseEnServiceTransmise.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<Payload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: Payload) {
    return payload.identifiantProjet;
  }
}
