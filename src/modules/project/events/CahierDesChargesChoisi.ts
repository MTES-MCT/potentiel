import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain';
import { DateParutionCahierDesChargesModifié } from '@entities/cahierDesCharges';

export type CahierDesChargesChoisiPayload = {
  projetId: string;
  choisiPar: string;
} & (
  | {
      type: 'initial';
    }
  | {
      type: 'modifié';
      paruLe: DateParutionCahierDesChargesModifié;
      alternatif?: true;
    }
);
export class CahierDesChargesChoisi
  extends BaseDomainEvent<CahierDesChargesChoisiPayload>
  implements DomainEvent
{
  public static type: 'CahierDesChargesChoisi' = 'CahierDesChargesChoisi';
  public type = CahierDesChargesChoisi.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<CahierDesChargesChoisiPayload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: CahierDesChargesChoisiPayload) {
    return payload.projetId;
  }
}
