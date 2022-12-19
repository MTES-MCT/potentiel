import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ok } from '@core/utils'
import { ProfilDéjàExistantError } from './ProfilDéjàExistantError'
import { Utilisateur } from '../Utilisateur'
import { ProfilUtilisateurCréé } from '../events/ProfilUtilisateurCréé'

export type CréerProfilUtilisateur = ReturnType<typeof makeCréerProfilUtilisateur>

type Dépendances = {
  utilisateurRepo: TransactionalRepository<Utilisateur>
  publishToEventStore: EventStore['publish']
}

type Commande = {
  email: string
  nom: string
  prénom: string
  fonction?: string
}

export const makeCréerProfilUtilisateur =
  ({ utilisateurRepo, publishToEventStore }: Dépendances) =>
  ({ email, nom, prénom, fonction }: Commande) =>
    utilisateurRepo.transaction(
      new UniqueEntityID(email),
      (utilisateur) => {
        if (utilisateur.statut === 'créé') {
          return errAsync(new ProfilDéjàExistantError({ email, role: utilisateur.role }))
        }
        publishToEventStore(
          new ProfilUtilisateurCréé({
            payload: {
              email,
              role: utilisateur.role || 'porteur-projet',
              nom,
              prénom,
              fonction,
            },
          })
        )
        return ok(utilisateur)
      },
      { acceptNew: true }
    )
