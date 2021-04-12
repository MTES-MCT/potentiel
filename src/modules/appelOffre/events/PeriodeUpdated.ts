import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface PeriodeUpdatedPayload {
  appelOffreId: string
  periodeId: string
  delta: any
  updatedBy: string
}
export class PeriodeUpdated extends BaseDomainEvent<PeriodeUpdatedPayload> implements DomainEvent {
  public static type: 'PeriodeUpdated' = 'PeriodeUpdated'
  public type = PeriodeUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: PeriodeUpdatedPayload) {
    return payload.appelOffreId
  }
}
