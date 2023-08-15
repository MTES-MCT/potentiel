import { BaseDomainEvent, DomainEvent } from '../../../core/domain';
import { UserRole } from "../../users";

type Payload = {
  email: string;
  role: UserRole;
  nom: string;
  prénom: string;
  fonction?: string;
};

export class ProfilUtilisateurCréé extends BaseDomainEvent<Payload> implements DomainEvent {
  public static type: 'ProfilUtilisateurCréé' = 'ProfilUtilisateurCréé';
  public type = ProfilUtilisateurCréé.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: Payload) {
    return payload.email;
  }
}
