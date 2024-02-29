import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '../../../core/domain';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export interface Payload {
  dateMiseEnService: string;
  référenceDossierRaccordement: string;
  identifiantProjet: string;
}

/**
 * @deprecated à bouger dans la nouvelle app
 */
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
