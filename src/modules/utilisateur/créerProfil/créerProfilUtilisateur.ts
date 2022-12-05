import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync } from '@core/utils'
import { UserRole } from '@modules/users'
import { ProfilDéjàExistantError } from './ProfilDéjàExistantError'
import { RoleIncorrectError } from './RoleIncorrectError'
import { Utilisateur } from '../Utilisateur'
import { ProfilUtilisateurCréé } from '../events/ProfilUtilisateurCréé'

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  role: UserRole
  nom: string
  prénom: string
  fonction: string
}

export const makeCréerProfilUtilisateur =
  ({ utilisateurRepo, publishToEventStore }: Dépendances) =>
  ({ email, role, nom, prénom, fonction }: Commande) =>
    utilisateurRepo.transaction(new UniqueEntityID(email), (utilisateur) => {
      if (utilisateur.statut === 'créé') {
        return errAsync(new ProfilDéjàExistantError({ email, role }))
      }

      if (utilisateur.statut === 'invité' && utilisateur.role !== role) {
        return errAsync(new RoleIncorrectError({ email, role }))
      }

      return publishToEventStore(
        new ProfilUtilisateurCréé({
          payload: {
            email,
            role,
            nom,
            prénom,
            fonction,
          },
        })
      )
    })
