import { UniqueEntityID, DomainEvent, EventStoreAggregate } from '@core/domain';
import { ok } from '@core/utils';
import { UserCreated, UserRole } from '@modules/users';
import { UtilisateurInvité, ProfilUtilisateurCréé } from './events';

type UtilisateurArgs = {
  id: UniqueEntityID;
  events?: DomainEvent[];
};

export type Utilisateur = EventStoreAggregate & {
  statut: 'invité' | 'créé' | undefined;
  email: string | undefined;
  role: UserRole;
};

export const makeUtilisateur = (args: UtilisateurArgs) => {
  const { events = [], id } = args;

  const agrégatParDefaut: Utilisateur = {
    statut: undefined,
    id,
    pendingEvents: [],
    email: undefined,
    role: 'porteur-projet',
  };

  const agrégat: Utilisateur = events.reduce((agregat, event) => {
    switch (event.type) {
      case UtilisateurInvité.type:
        return {
          ...agregat,
          email: event.payload.email,
          role: event.payload.role,
          statut: 'invité',
        };
      case ProfilUtilisateurCréé.type:
      case UserCreated.type:
        return {
          ...agregat,
          email: event.payload.email,
          role: event.payload.role,
          statut: 'créé',
        };
      default:
        return agregat;
    }
  }, agrégatParDefaut);

  return ok(agrégat);
};
