import { createUserCredentials } from '@config/credentials.config'
import { makeOnProfilUtilisateurCréé, ProfilUtilisateurCréé } from '@modules/utilisateur'
import { subscribeToRedis } from '../eventBus.config'
import { DomainEvent } from '@core/domain'

const onProfilUtilisateurCrééHandler = makeOnProfilUtilisateurCréé(createUserCredentials)

const onProfilUtilisateurCréé = async (event: DomainEvent) => {
  if (!(event instanceof ProfilUtilisateurCréé)) {
    return Promise.resolve()
  }
  return onProfilUtilisateurCrééHandler(event)
}
subscribeToRedis(onProfilUtilisateurCréé, 'Utilisateur.onProfilUtilisateurCréé')
