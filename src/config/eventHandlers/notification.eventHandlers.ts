import { DomainEvent } from '@core/domain'
import { UserInvitedToProject } from '@modules/authZ'
import {
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDemandeDélaiAnnulé,
} from '@modules/demandeModification'
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
  makeOnRejetDemandeDélaiAnnulé,
  makeOnDélaiEnInstruction,
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
const onDélaiAccordéHandler = makeOnDélaiAccordé({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
const onDélaiRejetéHandler = makeOnDélaiRejeté({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
const OnRejetDemandeDélaiAnnuléHandler = makeOnRejetDemandeDélaiAnnulé({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})
const onDélaiAnnuléHandler = makeOnDélaiAnnulé({
  sendNotification,
  getModificationRequestRecipient,
  getModificationRequestInfoForStatusNotification,
  findUsersForDreal: oldUserRepo.findUsersForDreal,
  dgecEmail: process.env.DGEC_EMAIL,
})
const onDélaiEnInstructionHandler = makeOnDélaiEnInstruction({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})

const onDemandeDélaiEvénements = async (event: DomainEvent) => {
  if (event instanceof DélaiDemandé) {
    return await onDélaiDemandéHandler(event)
  }
  if (event instanceof DélaiAccordé) {
    return await onDélaiAccordéHandler(event)
  }
  if (event instanceof DélaiRejeté) {
    return await onDélaiRejetéHandler(event)
  }
  if (event instanceof RejetDemandeDélaiAnnulé) {
    return await OnRejetDemandeDélaiAnnuléHandler(event)
  }
  if (event instanceof DélaiAnnulé) {
    return await onDélaiAnnuléHandler(event)
  }
  if (event instanceof DélaiEnInstruction) {
    return await onDélaiEnInstructionHandler(event)
  }

  return Promise.resolve()
}
subscribeToRedis(onDemandeDélaiEvénements, 'Notification')

console.log('Notification Event Handlers Initialized')
export const notificationHandlersOk = true
