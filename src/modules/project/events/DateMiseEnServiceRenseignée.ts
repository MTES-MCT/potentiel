import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface DateMiseEnServiceRenseignéedPayload {
  projetId: string
  dateMiseEnService: string
}
export class DateMiseEnServiceRenseignée
  extends BaseDomainEvent<DateMiseEnServiceRenseignéedPayload>
  implements DomainEvent
{
  public static type: 'DateMiseEnServiceRenseignée' = 'DateMiseEnServiceRenseignée'
  public type = DateMiseEnServiceRenseignée.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<DateMiseEnServiceRenseignéedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: DateMiseEnServiceRenseignéedPayload) {
    return payload.projetId
  }
}
