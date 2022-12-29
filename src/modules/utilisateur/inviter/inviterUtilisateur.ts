import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync } from '@core/utils'
import { UserRole } from '@modules/users'
import { InvitationUniqueParUtilisateurError } from './InvitationUniqueParUtilisateurError'
import { InvitationUtilisateurExistantError } from './InvitationUtilisateurExistantError'
import { Utilisateur } from '../Utilisateur'
import { UtilisateurInvité } from '../events/UtilisateurInvité'
import { Permission } from '@modules/authN'
import { InvitationUtilisateurNonAutoriséeError } from './InvitationUtilisateurNonAutoriséeError'

export const PermissionInviterDgecValidateur: Permission = {
  nom: 'inviter-dgec-validateur-action',
  description: 'Inviter un utilisateur dgec-validateur',
}

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  role: UserRole
  invitéPar: { permissions: Array<Permission> }
}

export const makeInviterUtilisateur =
  ({ utilisateurRepo, publishToEventStore }: Dépendances) =>
  ({ email, role, invitéPar }: Commande) =>
    utilisateurRepo.transaction(
      new UniqueEntityID(email),
      (utilisateur) => {
        if (
          role === 'dgec-validateur' &&
          !invitéPar.permissions.includes(PermissionInviterDgecValidateur)
        ) {
          return errAsync(new InvitationUtilisateurNonAutoriséeError({ email, role }))
        }

        if (utilisateur.statut === 'invité') {
          return errAsync(new InvitationUniqueParUtilisateurError({ email, role }))
        }
        if (utilisateur.statut === 'créé') {
          return errAsync(new InvitationUtilisateurExistantError({ email, role }))
        }

        return publishToEventStore(
          new UtilisateurInvité({
            payload: {
              email,
              role,
            },
          })
        )
      },
      { acceptNew: true }
    )
