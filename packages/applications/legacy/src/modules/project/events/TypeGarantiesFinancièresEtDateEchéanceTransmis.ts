import { DomainEvent, BaseDomainEvent } from '../../../core/domain';

type Payload = {
  projectId: string;
  type: string;
  dateEchéance?: string;
};

export class TypeGarantiesFinancièresEtDateEchéanceTransmis
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'TypeGarantiesFinancièresEtDateEchéanceTransmis' =
    'TypeGarantiesFinancièresEtDateEchéanceTransmis';
  public type = TypeGarantiesFinancièresEtDateEchéanceTransmis.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.projectId;
  }
}
