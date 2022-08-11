import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface AppelOffreUpdatedPayload {
  appelOffreId: string
  delta: any
  updatedBy: string
}
export class AppelOffreUpdated
  extends BaseDomainEvent<AppelOffreUpdatedPayload>
  implements DomainEvent
{
  public static type: 'AppelOffreUpdated' = 'AppelOffreUpdated'
  public type = AppelOffreUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AppelOffreUpdatedPayload) {
    return payload.appelOffreId
  }
}
