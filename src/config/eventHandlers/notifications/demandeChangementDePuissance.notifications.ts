import { notificationEventSubscriber } from './notificationEventSubscriber'
import {
  ChangementDePuissanceDemandé,
  RejetChangementDePuissanceAnnulé,
} from '@modules/demandeModification'
import {
  makeOnChangementDePuissanceDemandé,
  makeOnRejetChangementDePuissanceAnnulé,
} from '@modules/notification'
import { sendNotification } from '../../emails.config'
import {
  getInfoForModificationRequested,
  getModificationRequestInfoForStatusNotification,
} from '../../queries.config'

import { oldProjectRepo, oldUserRepo } from '../../repos.config'
import { notifierPorteurChangementStatutDemande } from '../../useCases.config'

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set')
  process.exit(1)
}

notificationEventSubscriber(
  ChangementDePuissanceDemandé,
  makeOnChangementDePuissanceDemandé({
    sendNotification,
    getInfoForModificationRequested,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    findProjectById: oldProjectRepo.findById,
  })
)

notificationEventSubscriber(
  RejetChangementDePuissanceAnnulé,
  makeOnRejetChangementDePuissanceAnnulé({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  })
)
