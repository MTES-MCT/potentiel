import { DomainEvent } from '@core/domain'
import { UserInvitedToProject } from '@modules/authZ'
import { DélaiAccordé, DélaiAnnulé, DélaiDemandé, DélaiRejeté } from '@modules/demandeModification'
import { LegacyCandidateNotified } from '@modules/legacyCandidateNotification'
import {
  ConfirmationRequested,
  ModificationReceived,
  ModificationRequestAccepted,
  ModificationRequestCancelled,
  ModificationRequestConfirmed,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '@modules/modificationRequest'
import {
  handleLegacyCandidateNotified,
  handleModificationReceived,
  handleModificationRequestCancelled,
  handleModificationRequestConfirmed,
  handleModificationRequested,
  handleModificationRequestStatusChanged,
  handleNewRulesOptedIn,
  handleProjectCertificateUpdatedOrRegenerated,
  handleProjectGFSubmitted,
  handleUserInvitedToProject,
  makeOnDélaiAccordé,
  makeOnDélaiAnnulé,
  makeOnDélaiDemandé,
  makeOnDélaiRejeté,
} from '@modules/notification'
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectGFSubmitted,
  ProjectNewRulesOptedIn,
} from '@modules/project'
import { sendNotification } from '../emails.config'
import { subscribeToRedis } from '../eventBus.config'
import { eventStore } from '../eventStore.config'
import {
  getInfoForModificationRequested,
  getModificationRequestInfoForConfirmedNotification,
  getModificationRequestInfoForStatusNotification,
  getModificationRequestRecipient,
} from '../queries.config'
import { oldProjectRepo, oldUserRepo, projectRepo } from '../repos.config'

const projectCertificateChangeHandler = handleProjectCertificateUpdatedOrRegenerated({
  sendNotification,
  projectRepo,
  getUsersForProject: oldProjectRepo.getUsers,
})

eventStore.subscribe(ProjectCertificateUpdated.type, projectCertificateChangeHandler)
eventStore.subscribe(ProjectCertificateRegenerated.type, projectCertificateChangeHandler)

const modificationRequestStatusChangeHandler = handleModificationRequestStatusChanged({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
eventStore.subscribe(
  ModificationRequestInstructionStarted.type,
  modificationRequestStatusChangeHandler
)
eventStore.subscribe(ModificationRequestAccepted.type, modificationRequestStatusChangeHandler)
eventStore.subscribe(ModificationRequestRejected.type, modificationRequestStatusChangeHandler)
eventStore.subscribe(ConfirmationRequested.type, modificationRequestStatusChangeHandler)
eventStore.subscribe(ModificationRequestCancelled.type, modificationRequestStatusChangeHandler)

eventStore.subscribe(
  ModificationRequested.type,
  handleModificationRequested({
    sendNotification,
    getInfoForModificationRequested,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    findProjectById: oldProjectRepo.findById,
  })
)

eventStore.subscribe(
  ModificationRequestConfirmed.type,
  handleModificationRequestConfirmed({
    sendNotification,
    getModificationRequestInfoForConfirmedNotification,
  })
)

eventStore.subscribe(
  ProjectGFSubmitted.type,
  handleProjectGFSubmitted({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  })
)

if (!process.env.DGEC_EMAIL) {
  console.error('ERROR: DGEC_EMAIL is not set')
  process.exit(1)
}

eventStore.subscribe(
  ModificationRequestCancelled.type,
  handleModificationRequestCancelled({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    getModificationRequestInfo: getModificationRequestInfoForStatusNotification,
    getModificationRequestRecipient,
    dgecEmail: process.env.DGEC_EMAIL,
  })
)

eventStore.subscribe(
  ModificationReceived.type,
  handleModificationReceived({
    sendNotification,
    findUsersForDreal: oldUserRepo.findUsersForDreal,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  })
)

eventStore.subscribe(
  UserInvitedToProject.type,
  handleUserInvitedToProject({
    sendNotification,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  })
)

eventStore.subscribe(
  ProjectNewRulesOptedIn.type,
  handleNewRulesOptedIn({
    sendNotification,
    findUserById: oldUserRepo.findById,
    findProjectById: oldProjectRepo.findById,
  })
)

eventStore.subscribe(
  LegacyCandidateNotified.type,
  handleLegacyCandidateNotified({
    sendNotification,
  })
)

const onDélaiDemandéHandler = makeOnDélaiDemandé({
  sendNotification,
  getInfoForModificationRequested,
  findUsersForDreal: oldUserRepo.findUsersForDreal,
  findProjectById: oldProjectRepo.findById,
})
const onDélaiDemandé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiDemandé)) {
    return Promise.resolve()
  }

  return await onDélaiDemandéHandler(event)
}
subscribeToRedis(onDélaiDemandé, 'Notification.onDélaiDemandé')

const onDélaiAccordéHandler = makeOnDélaiAccordé({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
const onDélaiAccordé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiAccordé)) {
    return Promise.resolve()
  }

  return await onDélaiAccordéHandler(event)
}
subscribeToRedis(onDélaiAccordé, 'Notification.onDélaiAccordé')

const onDélaiRejetéHandler = makeOnDélaiRejeté({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
const onDélaiRejeté = async (event: DomainEvent) => {
  if (!(event instanceof DélaiRejeté)) {
    return Promise.resolve()
  }

  return await onDélaiRejetéHandler(event)
}
subscribeToRedis(onDélaiRejeté, 'Notification.onDélaiRejeté')

const onDélaiAnnuléHandler = makeOnDélaiAnnulé({
  sendNotification,
  getModificationRequestRecipient,
  getModificationRequestInfoForStatusNotification,
  findUsersForDreal: oldUserRepo.findUsersForDreal,
  dgecEmail: process.env.DGEC_EMAIL,
})
const onDélaiAnnulé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiAnnulé)) {
    return Promise.resolve()
  }

  return await onDélaiAnnuléHandler(event)
}
subscribeToRedis(onDélaiAnnulé, 'Notification.onDélaiAnnulé')

console.log('Notification Event Handlers Initialized')
export const notificationHandlersOk = true
