import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface AppelOffreCreatedPayload {
  appelOffreId: string
  data: any
  createdBy: string
}
export class AppelOffreCreated
  extends BaseDomainEvent<AppelOffreCreatedPayload>
  implements DomainEvent {
  public static type: 'AppelOffreCreated' = 'AppelOffreCreated'
  public type = AppelOffreCreated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AppelOffreCreatedPayload) {
    return payload.appelOffreId
  }
}
