import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface PeriodeCreatedPayload {
  appelOffreId: string
  periodeId: string
  data: any
  createdBy: string
}
export class PeriodeCreated extends BaseDomainEvent<PeriodeCreatedPayload> implements DomainEvent {
  public static type: 'PeriodeCreated' = 'PeriodeCreated'
  public type = PeriodeCreated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: PeriodeCreatedPayload) {
    return payload.appelOffreId
  }
}
