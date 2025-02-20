import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

export interface UtilisateurDésactivéPayload {
  userId: string;
  email: string;
}
export class UtilisateurDésactivé
  extends BaseDomainEvent<UtilisateurDésactivéPayload>
  implements DomainEvent
{
  public static type: 'UtilisateurDésactivé' = 'UtilisateurDésactivé';
  public type = UtilisateurDésactivé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: UtilisateurDésactivéPayload) {
    return payload.email;
  }
}
