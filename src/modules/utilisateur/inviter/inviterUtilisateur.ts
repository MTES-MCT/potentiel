import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync } from '@core/utils'
import { UserRole } from '@modules/users'
import { InvitationUniqueParUtilisateurError } from './InvitationUniqueParUtilisateurError'
import { Utilisateur } from '../Utilisateur'
import { UtilisateurInvité } from '../events/UtilisateurInvité'

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  role: UserRole
}

export const makeInviterUtilisateur =
  ({ utilisateurRepo, publishToEventStore }: Dépendances) =>
  ({ email, role }: Commande) =>
    utilisateurRepo.transaction(new UniqueEntityID(email), (utilisateur) => {
      if (utilisateur.statut === 'invité') {
        return errAsync(new InvitationUniqueParUtilisateurError({ email, role }))
      }

      return publishToEventStore(
        new UtilisateurInvité({
          payload: {
            email,
            role,
          },
        })
      )
    })
