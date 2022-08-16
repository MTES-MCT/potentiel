import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface AppelOffreRemovedPayload {
  appelOffreId: string
  removedBy: string
}
export class AppelOffreRemoved
  extends BaseDomainEvent<AppelOffreRemovedPayload>
  implements DomainEvent
{
  public static type: 'AppelOffreRemoved' = 'AppelOffreRemoved'
  public type = AppelOffreRemoved.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AppelOffreRemovedPayload) {
    return payload.appelOffreId
  }
}
