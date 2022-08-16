import { BaseDomainEvent, DomainEvent } from '@core/domain'

//
// This event is a value dump for items that were in the projects database table before the switch to event sourcing
//

export interface UserRightsToProjectRevokedPayload {
  projectId: string
  userId: string
  revokedBy: string
}
export class UserRightsToProjectRevoked
  extends BaseDomainEvent<UserRightsToProjectRevokedPayload>
  implements DomainEvent
{
  public static type: 'UserRightsToProjectRevoked' = 'UserRightsToProjectRevoked'
  public type = UserRightsToProjectRevoked.type
  currentVersion = 1

  aggregateIdFromPayload(payload: UserRightsToProjectRevokedPayload) {
    return undefined
  }
}
