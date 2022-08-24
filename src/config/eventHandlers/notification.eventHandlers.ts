import { DomainEvent } from '@core/domain'
import { UserInvitedToProject } from '@modules/authZ'
import {
  AbandonAccordé,
  AbandonAnnulé,
  AbandonConfirmé,
  AbandonDemandé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
  RejetRecoursAnnulé,
} from '@modules/demandeModification'
import { LegacyCandidateNotified } from '@modules/legacyCandidateNotification'
import {
  ConfirmationRequested,
  ModificationReceived,
  ModificationRequestAccepted,
  ModificationRequestCancelled,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '@modules/modificationRequest'
import {
  handleLegacyCandidateNotified,
  handleModificationReceived,
  handleModificationRequestCancelled,
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
  makeOnRejetDélaiAnnulé,
  makeOnDélaiEnInstruction,
  makeOnRejetRecoursAnnulé,
  makeOnAbandonAccordé,
  makeOnAbandonRejeté,
  makeOnAbandonDemandé,
  makeOnConfirmationAbandonDemandée,
  makeOnAbandonConfirmé,
  makeOnAbandonAnnulé,
} from '@modules/notification'
import {
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectGFSubmitted,
  ProjectNewRulesOptedIn,
} from '@modules/project'
import { notifierPorteurChangementStatutDemande, sendNotification } from '../emails.config'
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
const OnRejetDemandeDélaiAnnuléHandler = makeOnRejetDélaiAnnulé({
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

const onRejetRecoursAnnuléHandler = makeOnRejetRecoursAnnulé({
  sendNotification,
  getModificationRequestInfoForStatusNotification,
})

const onAbandonAccordéHandler = makeOnAbandonAccordé({
  getModificationRequestInfoForStatusNotification,
  notifierPorteurChangementStatutDemande,
})

const onAbandonRejetéHandler = makeOnAbandonRejeté({
  getModificationRequestInfoForStatusNotification,
  notifierPorteurChangementStatutDemande,
})

const onAbandonAnnuléHandler = makeOnAbandonAnnulé({
  sendNotification,
  getModificationRequestInfo: getModificationRequestInfoForStatusNotification,
  dgecEmail: process.env.DGEC_EMAIL,
})

const onAbandonDemandéHandler = makeOnAbandonDemandé({
  getModificationRequestInfoForStatusNotification,
  notifierPorteurChangementStatutDemande,
})

const onConfirmationAbandonDemandéeHandler = makeOnConfirmationAbandonDemandée({
  getModificationRequestInfoForStatusNotification,
  notifierPorteurChangementStatutDemande,
})

const onAbandonConfirméHandler = makeOnAbandonConfirmé({
  sendNotification,
  getModificationRequestInfoForConfirmedNotification,
})

const onDemandesEvénements = async (event: DomainEvent) => {
  if (event instanceof DélaiDemandé) {
    return await onDélaiDemandéHandler(event)
  }
  if (event instanceof DélaiAccordé) {
    return await onDélaiAccordéHandler(event)
  }
  if (event instanceof DélaiRejeté) {
    return await onDélaiRejetéHandler(event)
  }
  if (event instanceof RejetDélaiAnnulé) {
    return await OnRejetDemandeDélaiAnnuléHandler(event)
  }
  if (event instanceof DélaiAnnulé) {
    return await onDélaiAnnuléHandler(event)
  }
  if (event instanceof DélaiEnInstruction) {
    return await onDélaiEnInstructionHandler(event)
  }
  if (event instanceof RejetRecoursAnnulé) {
    return await onRejetRecoursAnnuléHandler(event)
  }

  if (event instanceof AbandonAccordé) {
    return await onAbandonAccordéHandler(event)
  }

  if (event instanceof AbandonRejeté) {
    return await onAbandonRejetéHandler(event)
  }

  if (event instanceof AbandonAnnulé) {
    return await onAbandonAnnuléHandler(event)
  }

  if (event instanceof ConfirmationAbandonDemandée) {
    return await onConfirmationAbandonDemandéeHandler(event)
  }

  if (event instanceof AbandonConfirmé) {
    return await onAbandonConfirméHandler(event)
  }

  if (event instanceof AbandonDemandé) {
    return await onAbandonDemandéHandler(event)
  }

  return Promise.resolve()
}

subscribeToRedis(onDemandesEvénements, 'Notification')

console.log('Notification Event Handlers Initialized')
export const notificationHandlersOk = true
