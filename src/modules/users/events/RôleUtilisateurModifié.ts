import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { UserRole } from '../UserRoles'

export interface RôleUtilisateurModifiéPayload {
  userId: string
  email: string
  role: UserRole
}
export class RôleUtilisateurModifié
  extends BaseDomainEvent<RôleUtilisateurModifiéPayload>
  implements DomainEvent
{
  public static type: 'RôleUtilisateurModifié' = 'RôleUtilisateurModifié'
  public type = RôleUtilisateurModifié.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RôleUtilisateurModifiéPayload) {
    return payload.email
  }
}
