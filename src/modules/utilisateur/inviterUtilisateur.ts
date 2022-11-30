import { EventStore } from '@core/domain'
import { UserRole } from '@modules/users'
import { UtilisateurInvité } from './UtilisateurInvité'

type Dépendances = {
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  role: UserRole
}

export const makeInviterUtilisateur =
  ({ publishToEventStore }: Dépendances) =>
  ({ email, role }: Commande) =>
    publishToEventStore(
      new UtilisateurInvité({
        payload: {
          email,
          role,
        },
      })
    )
