import { eventStore } from '@config/eventStore.config'
import { fileStorageService } from '@config/fileStorage.config'
import { buildProjectIdentifier } from '@config/crypto.config'
import { makeAppelOffre } from '@modules/appelOffre'
import { makeCandidateNotification } from '@modules/candidateNotification'
import { makeUser } from '@modules/users'
import models from '../models'
import { makeFileRepo } from './fileRepo'
import { makeModificationRequestRepo } from './modificationRequestRepo'
import { NotificationRepo } from './notificationRepo'
import { makeProjectRepo } from './projectRepo'
import { makeProjectClaimRepo } from './projectClaimRepo'
import { makeLegacyCandidateNotification } from '@modules/legacyCandidateNotification'
import { makeEventStoreRepo, makeEventStoreTransactionalRepo } from '@core/utils'
import { makeDemandeDélai, makeDemandeAbandon } from '@modules/demandeModification'
import { makeImportDonnéesRaccordement } from '@modules/imports/donnéesRaccordement'
import { makeUtilisateur } from '@modules/utilisateur'
import { makeDemandeChangementDePuissance } from '@modules/demandeModification/demandeChangementDePuissance/DemandeChangementDePuissance'

export const fileRepo = makeFileRepo({ models, fileStorageService })
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
})
export const legacyCandidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeLegacyCandidateNotification,
})
export const projectRepo = makeProjectRepo(eventStore, buildProjectIdentifier)
export const projectClaimRepo = makeProjectClaimRepo(eventStore)
export const modificationRequestRepo = makeModificationRequestRepo(eventStore)
export const appelOffreRepo = makeEventStoreRepo({
  eventStore,
  makeAggregate: makeAppelOffre,
})
export const userRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeUser,
})
export const demandeDélaiRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeDélai,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeDélai,
  }),
}

export const demandeAbandonRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeAbandon,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeAbandon,
  }),
}

export const demandeChangementDePuissanceRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeChangementDePuissance,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeChangementDePuissance,
  }),
}

export const importRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeImportDonnéesRaccordement,
  }),
}

export const utilisateurRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeUtilisateur,
  }),
}
