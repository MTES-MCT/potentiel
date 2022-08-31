import { notificationEventSubscriber } from './notificationEventSubscriber'
import {
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
  RejetRecoursAnnulé,
} from '@modules/demandeModification'
import {
  makeOnDélaiAccordé,
  makeOnDélaiAnnulé,
  makeOnDélaiDemandé,
  makeOnDélaiRejeté,
  makeOnRejetDélaiAnnulé,
  makeOnDélaiEnInstruction,
  makeOnRejetRecoursAnnulé,
} from '@modules/notification'
import { sendNotification } from '../../emails.config'
import {
  getInfoForModificationRequested,
  getModificationRequestInfoForStatusNotification,
  getModificationRequestRecipient,
} from '../../queries.config'
import { oldProjectRepo, oldUserRepo } from '../../repos.config'

notificationEventSubscriber(
  RejetRecoursAnnulé,
  makeOnRejetRecoursAnnulé({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
  })
)
