import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { UserRole } from '@modules/users'

export type Payload = {
  email: string
  role: UserRole
}

export class UtilisateurInvité extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'UtilisateurInvité' = 'UtilisateurInvité'
  public type = UtilisateurInvité.type
  currentVersion = 1

  aggregateIdFromPayload(payload: Payload) {
    return payload.email
  }
}
