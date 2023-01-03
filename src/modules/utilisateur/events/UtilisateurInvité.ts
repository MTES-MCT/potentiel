import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { UserRole } from '@modules/users'

type Payload = {
  email: string
} & (
  | {
      role: Exclude<UserRole, 'dgec-validateur'>
    }
  | {
      role: 'dgec-validateur'
      fonction: string
    }
)

export class UtilisateurInvité extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'UtilisateurInvité' = 'UtilisateurInvité'
  public type = UtilisateurInvité.type
  currentVersion = 1

  aggregateIdFromPayload(payload: Payload) {
    return payload.email
  }
}
