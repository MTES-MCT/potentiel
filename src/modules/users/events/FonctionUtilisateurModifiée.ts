import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface FonctionUtilisateurModifiéePayload {
  userId: string
  email: string
  fonction: string
}
export class FonctionUtilisateurModifiée
  extends BaseDomainEvent<FonctionUtilisateurModifiéePayload>
  implements DomainEvent
{
  public static type: 'FonctionUtilisateurModifiée' = 'FonctionUtilisateurModifiée'
  public type = FonctionUtilisateurModifiée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: FonctionUtilisateurModifiéePayload) {
    return payload.email
  }
}
