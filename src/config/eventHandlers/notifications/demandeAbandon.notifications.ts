import { notificationEventSubscriber } from './notificationEventSubscriber'
import {
  AbandonAccordé,
  AbandonAnnulé,
  AbandonConfirmé,
  AbandonDemandé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
  RejetAbandonAnnulé,
} from '@modules/demandeModification'
import {
  makeOnAbandonAccordé,
  makeOnAbandonRejeté,
  makeOnAbandonAnnulé,
  makeOnAbandonDemandé,
  makeOnConfirmationAbandonDemandée,
  makeOnAbandonConfirmé,
  makeOnRejetAbandonAnnulé,
} from '@modules/notification'
import { sendNotification } from '../../emails.config'
import {
  getModificationRequestInfoForStatusNotification,
  getModificationRequestInfoForConfirmedNotification,
} from '../../queries.config'
import { notifierPorteurChangementStatutDemande } from '@config/useCases.config'

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set')
  process.exit(1)
}

notificationEventSubscriber(
  AbandonAccordé,
  makeOnAbandonAccordé({
    getModificationRequestInfoForStatusNotification,
    notifierPorteurChangementStatutDemande,
  })
)

notificationEventSubscriber(
  AbandonRejeté,
  makeOnAbandonRejeté({
    getModificationRequestInfoForStatusNotification,
    notifierPorteurChangementStatutDemande,
  })
)

notificationEventSubscriber(
  AbandonAnnulé,
  makeOnAbandonAnnulé({
    sendNotification,
    getModificationRequestInfo: getModificationRequestInfoForStatusNotification,
    dgecEmail: process.env.DGEC_EMAIL,
  })
)

notificationEventSubscriber(
  AbandonDemandé,
  makeOnAbandonDemandé({
    getModificationRequestInfoForStatusNotification,
    notifierPorteurChangementStatutDemande,
  })
)

notificationEventSubscriber(
  ConfirmationAbandonDemandée,
  makeOnConfirmationAbandonDemandée({
    getModificationRequestInfoForStatusNotification,
    notifierPorteurChangementStatutDemande,
  })
)

notificationEventSubscriber(
  AbandonConfirmé,
  makeOnAbandonConfirmé({
    sendNotification,
    getModificationRequestInfoForConfirmedNotification,
  })
)

notificationEventSubscriber(
  RejetAbandonAnnulé,
  makeOnRejetAbandonAnnulé({
    notifierPorteurChangementStatutDemande,
    getModificationRequestInfoForStatusNotification,
  })
)
