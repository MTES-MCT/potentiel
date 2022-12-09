import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { UserRole } from '../UserRoles'

export interface UserCreatedPayload {
  userId: string
  email: string
  role: UserRole
  fullName?: string
  createdBy?: string
}
export class UserCreated extends BaseDomainEvent<UserCreatedPayload> implements DomainEvent {
  public static type: 'UserCreated' = 'UserCreated'
  public type = UserCreated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: UserCreatedPayload) {
    return payload.email
  }
}
