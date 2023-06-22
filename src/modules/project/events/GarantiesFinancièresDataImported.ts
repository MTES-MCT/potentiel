import { DomainEvent, BaseDomainEvent } from '@core/domain';

type Payload = {
  projectId: string;
  type: string;
  dateEchéance?: string;
};

export class GarantiesFinancièresDataImported
  extends BaseDomainEvent<Payload>
  implements DomainEvent
{
  public static type: 'GarantiesFinancièresDataImported' = 'GarantiesFinancièresDataImported';
  public type = GarantiesFinancièresDataImported.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.projectId;
  }
}
