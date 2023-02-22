import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain';

export interface DateEchéanceGFAjoutéePayload {
  projectId: string;
  submittedBy: string;
  expirationDate: Date;
}
export class DateEchéanceGFAjoutée
  extends BaseDomainEvent<DateEchéanceGFAjoutéePayload>
  implements DomainEvent
{
  public static type: 'DateEchéanceGFAjoutée' = 'DateEchéanceGFAjoutée';
  public type = DateEchéanceGFAjoutée.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<DateEchéanceGFAjoutéePayload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: DateEchéanceGFAjoutéePayload) {
    return payload.projectId;
  }
}
