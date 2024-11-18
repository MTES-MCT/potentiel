import { EventStore, TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { errAsync } from '../../../core/utils';
import { UserRole } from '../../users';
import { InvitationUniqueParUtilisateurError } from './InvitationUniqueParUtilisateurError';
import { InvitationUtilisateurExistantError } from './InvitationUtilisateurExistantError';
import { Utilisateur } from '../Utilisateur';
import { UtilisateurInvité } from '../events/UtilisateurInvité';
import { Permission } from '../../authN';
import { InvitationUtilisateurNonAutoriséeError } from './InvitationUtilisateurNonAutoriséeError';

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>;
  publishToEventStore: EventStore['publish'];
};

type Commande = {
  email: string;
  invitéPar: { permissions: Array<Permission> };
} & (
  | {
      role: Exclude<UserRole, 'dgec-validateur'>;
    }
  | {
      role: 'dgec-validateur';
      fonction: string;
    }
);

export const makeInviterUtilisateur =
  ({ utilisateurRepo, publishToEventStore }: Dépendances) =>
  (commande: Commande) =>
    utilisateurRepo.transaction(
      new UniqueEntityID(commande.email),
      (utilisateur) => {
        const { email, role, invitéPar } = commande;

        if (utilisateur.statut === 'invité') {
          return errAsync(new InvitationUniqueParUtilisateurError({ email, role }));
        }
        if (utilisateur.statut === 'créé') {
          return errAsync(new InvitationUtilisateurExistantError({ email, role }));
        }

        return publishToEventStore(
          new UtilisateurInvité({
            payload: {
              email,
              ...(role === 'dgec-validateur' ? { role, fonction: commande.fonction } : { role }),
            },
          }),
        );
      },
      { acceptNew: true },
    );
