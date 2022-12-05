import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ok } from '@core/utils'
import { UserRole } from '@modules/users'
import { ProfilDéjàExistantError } from './ProfilDéjàExistantError'
import { Utilisateur } from '../Utilisateur'

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  role: UserRole
}

export const makeCréerProfilUtilisateur =
  ({ utilisateurRepo }: Dépendances) =>
  ({ email, role }: Commande) =>
    utilisateurRepo.transaction(new UniqueEntityID(email), (utilisateur) => {
      if (utilisateur.statut === 'créé') {
        return errAsync(new ProfilDéjàExistantError({ email, role }))
      }

      return ok(null)
    })
