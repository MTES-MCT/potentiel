import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface UserRightsToProjectGrantedPayload {
  projectId: string
  userId: string
  grantedBy: string
}
export class UserRightsToProjectGranted
  extends BaseDomainEvent<UserRightsToProjectGrantedPayload>
  implements DomainEvent
{
  public static type: 'UserRightsToProjectGranted' = 'UserRightsToProjectGranted'
  public type = UserRightsToProjectGranted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: UserRightsToProjectGrantedPayload) {
    return undefined
  }
}
