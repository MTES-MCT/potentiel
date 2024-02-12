import { DomainEvent, BaseDomainEvent } from '../../../core/domain';

type Payload = {
  projectId: string;
};

export class DateEchéanceGarantiesFinancièresSupprimée
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'DateEchéanceGarantiesFinancièresSupprimée' =
    'DateEchéanceGarantiesFinancièresSupprimée';
  public type = DateEchéanceGarantiesFinancièresSupprimée.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.projectId;
  }
}
