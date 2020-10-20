import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

//
// This event is a value dump for items that were in the projects database table before the switch to event sourcing
//

export interface LegacyProjectSourcedPayload {
  projectId: string
  numeroCRE: string
  periodeId: string
  appelOffreId: string
  familleId: string
  content: Record<string, any>
}
export class LegacyProjectSourced
  extends BaseDomainEvent<LegacyProjectSourcedPayload>
  implements DomainEvent {
  public static type: 'LegacyProjectSourced' = 'LegacyProjectSourced'
  public type = LegacyProjectSourced.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyProjectSourcedPayload) {
    return payload.projectId
  }
}
