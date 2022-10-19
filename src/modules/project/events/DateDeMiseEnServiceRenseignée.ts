import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface DateDeMiseEnServiceRenseignéedPayload {
  projetId: string
  dateDeMiseEnService: string
}
export class DateDeMiseEnServiceRenseignée
  extends BaseDomainEvent<DateDeMiseEnServiceRenseignéedPayload>
  implements DomainEvent
{
  public static type: 'DateDeMiseEnServiceRenseignée' = 'DateDeMiseEnServiceRenseignée'
  public type = DateDeMiseEnServiceRenseignée.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<DateDeMiseEnServiceRenseignéedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: DateDeMiseEnServiceRenseignéedPayload) {
    return payload.projetId
  }
}
