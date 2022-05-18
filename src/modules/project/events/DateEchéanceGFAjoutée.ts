import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface DateEchéanceGFAjoutéePayload {
  projectId: string
  submittedBy: string
  expirationDate: Date
}
export class DateEchéanceGFAjoutée
  extends BaseDomainEvent<DateEchéanceGFAjoutéePayload>
  implements DomainEvent
{
  public static type: 'DateEchéanceGFAjoutée' = 'DateEchéanceGFAjoutée'
  public type = DateEchéanceGFAjoutée.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<DateEchéanceGFAjoutéePayload>) {
    super(props)

    // convert to date (in case it is a string)
    this.payload.expirationDate = new Date(this.payload.expirationDate)
  }

  aggregateIdFromPayload(payload: DateEchéanceGFAjoutéePayload) {
    return payload.projectId
  }
}
