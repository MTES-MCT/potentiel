
# Evenements

Tous les "faits" métier sont persistés sous forme d'événements.
Si quelque chose s'est passé sur l'application, alors il y aura un événement correspondant.

Ces événements peuvent être émis par différentes parties de l'application.
Ils peuvent également être écoutés pour le déclenchement d'effets (ex: envoi d'un email) ou la mise à jour de [projections](./PROJECTIONS.md).

## Sommaire

- appelOffre
  - [AppelOffreCreated](#appeloffrecreated)
  - [AppelOffreRemoved](#appeloffreremoved)
  - [AppelOffreUpdated](#appeloffreupdated)
  - [PeriodeCreated](#periodecreated)
  - [PeriodeUpdated](#periodeupdated)

- modificationRequest
  - [ConfirmationRequested](#confirmationrequested)
  - [LegacyModificationImported](#legacymodificationimported)
  - [ModificationReceived](#modificationreceived)
  - [ModificationRequestAccepted](#modificationrequestaccepted)
  - [ModificationRequestCancelled](#modificationrequestcancelled)
  - [ModificationRequestConfirmed](#modificationrequestconfirmed)
  - [ModificationRequestInstructionStarted](#modificationrequestinstructionstarted)
  - [ModificationRequestRejected](#modificationrequestrejected)
  - [ModificationRequestStatusUpdated](#modificationrequeststatusupdated)
  - [ModificationRequested](#modificationrequested)
  - [ResponseTemplateDownloaded](#responsetemplatedownloaded)
  - [LegacyModificationRawDataImported](#legacymodificationrawdataimported)
  - [LegacyModificationFileAttached](#legacymodificationfileattached)

- file
  - [FileAttachedToProject](#fileattachedtoproject)
  - [FileDetachedFromProject](#filedetachedfromproject)

- authZ
  - [DrealUserInvited](#drealuserinvited)
  - [InvitationToProjectCancelled](#invitationtoprojectcancelled)
  - [PartnerUserInvited](#partneruserinvited)
  - [UserInvitedToProject](#userinvitedtoproject)
  - [UserProjectsLinkedByContactEmail](#userprojectslinkedbycontactemail)
  - [UserRightsToProjectGranted](#userrightstoprojectgranted)
  - [UserRightsToProjectRevoked](#userrightstoprojectrevoked)

- project
  - [CertificatesForPeriodeRegenerated](#certificatesforperioderegenerated)
  - [CovidDelayGranted](#coviddelaygranted)
  - [DemandeAbandonSignaled](#demandeabandonsignaled)
  - [DemandeDelaiSignaled](#demandedelaisignaled)
  - [DemandeRecoursSignaled](#demanderecourssignaled)
  - [ImportExecuted](#importexecuted)
  - [LegacyProjectEventSourced](#legacyprojecteventsourced)
  - [LegacyProjectSourced](#legacyprojectsourced)
  - [NumeroGestionnaireSubmitted](#numerogestionnairesubmitted)
  - [PeriodeNotified](#periodenotified)
  - [ProjectAbandoned](#projectabandoned)
  - [ProjectActionnaireUpdated](#projectactionnaireupdated)
  - [ProjectCertificateDownloaded](#projectcertificatedownloaded)
  - [ProjectCertificateGenerated](#projectcertificategenerated)
  - [ProjectCertificateGenerationFailed](#projectcertificategenerationfailed)
  - [ProjectCertificateObsolete](#projectcertificateobsolete)
  - [ProjectCertificateRegenerated](#projectcertificateregenerated)
  - [ProjectCertificateUpdateFailed](#projectcertificateupdatefailed)
  - [ProjectCertificateUpdated](#projectcertificateupdated)
  - [ProjectClasseGranted](#projectclassegranted)
  - [ProjectCompletionDueDateCancelled](#projectcompletionduedatecancelled)
  - [ProjectCompletionDueDateSet](#projectcompletionduedateset)
  - [ProjectDCRDueDateCancelled](#projectdcrduedatecancelled)
  - [ProjectDCRDueDateSet](#projectdcrduedateset)
  - [ProjectDCRRemoved](#projectdcrremoved)
  - [ProjectDCRSubmitted](#projectdcrsubmitted)
  - [ProjectDataCorrected](#projectdatacorrected)
  - [ProjectFournisseursUpdated](#projectfournisseursupdated)
  - [ProjectGFDueDateCancelled](#projectgfduedatecancelled)
  - [ProjectGFDueDateSet](#projectgfduedateset)
  - [ProjectGFInvalidated](#projectgfinvalidated)
  - [ProjectGFReminded](#projectgfreminded)
  - [ProjectGFRemoved](#projectgfremoved)
  - [ProjectGFSubmitted](#projectgfsubmitted)
  - [ProjectGFUploaded](#projectgfuploaded)
  - [ProjectGFWithdrawn](#projectgfwithdrawn)
  - [ProjectImported](#projectimported)
  - [ProjectNewRulesOptedIn](#projectnewrulesoptedin)
  - [ProjectNotificationDateSet](#projectnotificationdateset)
  - [ProjectNotified](#projectnotified)
  - [ProjectPTFRemoved](#projectptfremoved)
  - [ProjectPTFSubmitted](#projectptfsubmitted)
  - [ProjectProducteurUpdated](#projectproducteurupdated)
  - [ProjectPuissanceUpdated](#projectpuissanceupdated)
  - [ProjectRawDataImported](#projectrawdataimported)
  - [ProjectReimported](#projectreimported)
  - [ProjectStepStatusUpdated](#projectstepstatusupdated)

- projectClaim
  - [ProjectClaimFailed](#projectclaimfailed)
  - [ProjectClaimed](#projectclaimed)
  - [ProjectClaimedByOwner](#projectclaimedbyowner)

- legacyCandidateNotification
  - [LegacyCandidateNotified](#legacycandidatenotified)

- users
  - [InvitationRelanceSent](#invitationrelancesent)
  - [LegacyUserCreated](#legacyusercreated)
  - [UserCreated](#usercreated)

- candidateNotification
  - [CandidateInformationOfCertificateUpdateFailed](#candidateinformationofcertificateupdatefailed)
  - [CandidateInformedOfCertificateUpdate](#candidateinformedofcertificateupdate)
  - [CandidateNotifiedForPeriode](#candidatenotifiedforperiode)



## Événements par module


## appelOffre

### [AppelOffreCreated](../src/modules/appelOffre/events/AppelOffreCreated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[importAppelOffreData](../src/modules/appelOffre/useCases/importAppelOffreData.ts)|[Mise à jour](../src/infra/sequelize/projections/appelOffre/updates/onAppelOffreCreated.ts) de [appelOffre](./PROJECTIONS.md#appeloffre)|




### [AppelOffreRemoved](../src/modules/appelOffre/events/AppelOffreRemoved.ts)



|Emetteurs|Récepteurs|
|---|---|
|[AppelOffre.remove](../src/modules/appelOffre/AppelOffre.ts)|[Mise à jour](../src/infra/sequelize/projections/appelOffre/updates/onAppelOffreRemoved.ts) de [appelOffre](./PROJECTIONS.md#appeloffre)|




### [AppelOffreUpdated](../src/modules/appelOffre/events/AppelOffreUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[AppelOffre.update](../src/modules/appelOffre/AppelOffre.ts)|[Mise à jour](../src/infra/sequelize/projections/appelOffre/updates/onAppelOffreUpdated.ts) de [appelOffre](./PROJECTIONS.md#appeloffre)|




### [PeriodeCreated](../src/modules/appelOffre/events/PeriodeCreated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[AppelOffre.updatePeriode](../src/modules/appelOffre/AppelOffre.ts)|[Mise à jour](../src/infra/sequelize/projections/appelOffre/updates/onPeriodeCreated.ts) de [appelOffre](./PROJECTIONS.md#appeloffre)|




### [PeriodeUpdated](../src/modules/appelOffre/events/PeriodeUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[AppelOffre.updatePeriode](../src/modules/appelOffre/AppelOffre.ts)|[Mise à jour](../src/infra/sequelize/projections/appelOffre/updates/onPeriodeUpdated.ts) de [appelOffre](./PROJECTIONS.md#appeloffre)|




## modificationRequest

### [ConfirmationRequested](../src/modules/modificationRequest/events/ConfirmationRequested.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.requestConfirmation](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onConfirmationRequested.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onConfirmationRequested.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|




### [LegacyModificationImported](../src/modules/modificationRequest/events/LegacyModificationImported.ts)



|Emetteurs|Récepteurs|
|---|---|
||[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onLegacyModificationImported.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onLegacyModificationImported.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||modificationRequest / [handleLegacyModificationRawDataImported](../src/modules/modificationRequest/eventHandlers/handleLegacyModificationRawDataImported.ts)|
||project / [handleLegacyModificationImported](../src/modules/project/eventHandlers/handleLegacyModificationImported.ts)|




### [ModificationReceived](../src/modules/modificationRequest/events/ModificationReceived.ts)



|Emetteurs|Récepteurs|
|---|---|
|[requestActionnaireModification](../src/modules/modificationRequest/useCases/requestActionnaireModification.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationReceived.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
|[requestFournisseursModification](../src/modules/modificationRequest/useCases/requestFournisseursModification.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationReceived.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[requestProducteurModification](../src/modules/modificationRequest/useCases/requestProducteurModification.ts)|notification / [handleModificationReceived](../src/modules/notification/eventHandlers/handleModificationReceived.ts)|
|[requestPuissanceModification](../src/modules/modificationRequest/useCases/requestPuissanceModification.ts)|notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|




### [ModificationRequestAccepted](../src/modules/modificationRequest/events/ModificationRequestAccepted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.accept](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestAccepted.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequestAccepted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|




### [ModificationRequestCancelled](../src/modules/modificationRequest/events/ModificationRequestCancelled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.cancel](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestCancelled.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequestCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestCancelled](../src/modules/notification/eventHandlers/handleModificationRequestCancelled.ts)|
||notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|




### [ModificationRequestConfirmed](../src/modules/modificationRequest/events/ModificationRequestConfirmed.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.confirm](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestConfirmed.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequestConfirmed.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestConfirmed](../src/modules/notification/eventHandlers/handleModificationRequestConfirmed.ts)|




### [ModificationRequestInstructionStarted](../src/modules/modificationRequest/events/ModificationRequestInstructionStarted.ts)



|Emetteurs|Récepteurs|
|---|---|
||[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestInstructionStarted.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequestInstructionStarted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|
||modificationRequest / [handleResponseTemplateDownloaded](../src/modules/modificationRequest/eventHandlers/handleResponseTemplateDownloaded.ts)|




### [ModificationRequestRejected](../src/modules/modificationRequest/events/ModificationRequestRejected.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.reject](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestRejected.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequestRejected.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleModificationRequestStatusChanged](../src/modules/notification/eventHandlers/handleModificationRequestStatusChanged.ts)|




### [ModificationRequestStatusUpdated](../src/modules/modificationRequest/events/ModificationRequestStatusUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ModificationRequest.updateStatus](../src/modules/modificationRequest/ModificationRequest.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequestStatusUpdated.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|




### [ModificationRequested](../src/modules/modificationRequest/events/ModificationRequested.ts)



|Emetteurs|Récepteurs|
|---|---|
|[requestActionnaireModification](../src/modules/modificationRequest/useCases/requestActionnaireModification.ts)|[Mise à jour](../src/infra/sequelize/projections/modificationRequest/updates/onModificationRequested.ts) de [modificationRequest](./PROJECTIONS.md#modificationrequest)|
|[requestPuissanceModification](../src/modules/modificationRequest/useCases/requestPuissanceModification.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onModificationRequested.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[requestModification](../src/useCases/requestModification.ts)|notification / [handleModificationRequested](../src/modules/notification/eventHandlers/handleModificationRequested.ts)|




### [ResponseTemplateDownloaded](../src/modules/modificationRequest/events/ResponseTemplateDownloaded.ts)



|Emetteurs|Récepteurs|
|---|---|
|[getModeleReponse](../src/controllers/modificationRequest/getModeleReponse.ts)|modificationRequest / [handleResponseTemplateDownloaded](../src/modules/modificationRequest/eventHandlers/handleResponseTemplateDownloaded.ts)|




### [LegacyModificationRawDataImported](../src/modules/modificationRequest/events/LegacyModificationRawDataImported.ts)



|Emetteurs|Récepteurs|
|---|---|
|[importProjects](../src/modules/project/useCases/importProjects.ts)|modificationRequest / [handleLegacyModificationRawDataImported](../src/modules/modificationRequest/eventHandlers/handleLegacyModificationRawDataImported.ts)|




### [LegacyModificationFileAttached](../src/modules/modificationRequest/events/LegacyModificationFileAttached.ts)



|Emetteurs|Récepteurs|
|---|---|
|[attachLegacyModificationFile](../src/modules/modificationRequest/useCases/attachLegacyModificationFile.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onLegacyModificationFileAttached.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




## file

### [FileAttachedToProject](../src/modules/file/events/FileAttachedToProject.ts)



|Emetteurs|Récepteurs|
|---|---|
|[postAttacherFichier](../src/controllers/project/postAttacherFichier.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onFileAttachedToProject.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [FileDetachedFromProject](../src/modules/file/events/FileDetachedFromProject.ts)



|Emetteurs|Récepteurs|
|---|---|
|[postRetirerFichier](../src/controllers/project/postRetirerFichier.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onFileDetachedFromProject.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




## authZ

### [DrealUserInvited](../src/modules/authZ/events/DrealUserInvited.ts)



|Emetteurs|Récepteurs|
|---|---|
|[postInviteUser](../src/controllers/admin/postInviteUser.ts)|[Mise à jour](../src/infra/sequelize/projections/userDreal/updates/onDrealUserInvited.ts) de [userDreal](./PROJECTIONS.md#userdreal)|




### [InvitationToProjectCancelled](../src/modules/authZ/events/InvitationToProjectCancelled.ts)



|Emetteurs|Récepteurs|
|---|---|




### [PartnerUserInvited](../src/modules/authZ/events/PartnerUserInvited.ts)



|Emetteurs|Récepteurs|
|---|---|
|[postInviteUser](../src/controllers/admin/postInviteUser.ts)||




### [UserInvitedToProject](../src/modules/authZ/events/UserInvitedToProject.ts)



|Emetteurs|Récepteurs|
|---|---|
|[inviteUserToProject](../src/modules/users/useCases/inviteUserToProject.ts)|[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onUserInvitedToProject.ts) de [userProjects](./PROJECTIONS.md#userprojects)|
||notification / [handleUserInvitedToProject](../src/modules/notification/eventHandlers/handleUserInvitedToProject.ts)|




### [UserProjectsLinkedByContactEmail](../src/modules/authZ/events/UserProjectsLinkedByContactEmail.ts)



|Emetteurs|Récepteurs|
|---|---|
||[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onUserProjectsLinkedByContactEmail.ts) de [userProjects](./PROJECTIONS.md#userprojects)|
||authZ / [handleUserCreated](../src/modules/authZ/eventHandlers/handleUserCreated.ts)|




### [UserRightsToProjectGranted](../src/modules/authZ/events/UserRightsToProjectGranted.ts)



|Emetteurs|Récepteurs|
|---|---|
||[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onUserRightsToProjectGranted.ts) de [userProjects](./PROJECTIONS.md#userprojects)|
||authZ / [handleProjectImported](../src/modules/authZ/eventHandlers/handleProjectImported.ts)|




### [UserRightsToProjectRevoked](../src/modules/authZ/events/UserRightsToProjectRevoked.ts)



|Emetteurs|Récepteurs|
|---|---|
|[revokeRightsToProject](../src/modules/authZ/useCases/revokeRightsToProject.ts)|[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onUserRightsToProjectRevoked.ts) de [userProjects](./PROJECTIONS.md#userprojects)|




## project

### [CertificatesForPeriodeRegenerated](../src/modules/project/events/CertificatesForPeriodeRegenerated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[regenerateCertificatesForPeriode](../src/modules/project/useCases/regenerateCertificatesForPeriode.ts)||




### [CovidDelayGranted](../src/modules/project/events/CovidDelayGranted.ts)



|Emetteurs|Récepteurs|
|---|---|
||[Mise à jour](../src/infra/sequelize/projections/project/updates/onCovidDelayGranted.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onCovidDelayGranted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [DemandeAbandonSignaled](../src/modules/project/events/DemandeAbandonSignaled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.signalerDemandeAbandon](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onDemandeAbandonSignaled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [DemandeDelaiSignaled](../src/modules/project/events/DemandeDelaiSignaled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.signalerDemandeDelai](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onDemandeDelaiSignaled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [DemandeRecoursSignaled](../src/modules/project/events/DemandeRecoursSignaled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.signalerDemandeRecours](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onDemandeRecoursSignaled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ImportExecuted](../src/modules/project/events/ImportExecuted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[importProjects](../src/modules/project/useCases/importProjects.ts)||




### [LegacyProjectEventSourced](../src/modules/project/events/LegacyProjectEventSourced.ts)



|Emetteurs|Récepteurs|
|---|---|




### [LegacyProjectSourced](../src/modules/project/events/LegacyProjectSourced.ts)



|Emetteurs|Récepteurs|
|---|---|




### [NumeroGestionnaireSubmitted](../src/modules/project/events/NumeroGestionnaireSubmitted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[requestModification](../src/useCases/requestModification.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onNumeroGestionnaireSubmitted.ts) de [project](./PROJECTIONS.md#project)|




### [PeriodeNotified](../src/modules/project/events/PeriodeNotified.ts)



|Emetteurs|Récepteurs|
|---|---|
|[postSendCandidateNotifications](../src/controllers/candidateNotification/postSendCandidateNotifications.ts)|project / [handlePeriodeNotified](../src/modules/project/eventHandlers/handlePeriodeNotified.ts)|




### [ProjectAbandoned](../src/modules/project/events/ProjectAbandoned.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.abandon](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectAbandoned.ts) de [project](./PROJECTIONS.md#project)|
|[Project.abandonLegacy](../src/modules/project/Project.ts)||
|[Project.signalerDemandeAbandon](../src/modules/project/Project.ts)||




### [ProjectActionnaireUpdated](../src/modules/project/events/ProjectActionnaireUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateActionnaire](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectActionnaireUpdated.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectCertificateDownloaded](../src/modules/project/events/ProjectCertificateDownloaded.ts)



|Emetteurs|Récepteurs|
|---|---|
|[getProjectCertificateFile](../src/controllers/candidateNotification/getProjectCertificateFile.ts)||




### [ProjectCertificateGenerated](../src/modules/project/events/ProjectCertificateGenerated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.addGeneratedCertificate](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCertificate.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCertificateGenerated.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||candidateNotification / [handleProjectCertificateGeneratedOrFailed](../src/modules/candidateNotification/eventHandlers/handleProjectCertificateGeneratedOrFailed.ts)|




### [ProjectCertificateGenerationFailed](../src/modules/project/events/ProjectCertificateGenerationFailed.ts)



|Emetteurs|Récepteurs|
|---|---|
||candidateNotification / [handleProjectCertificateGeneratedOrFailed](../src/modules/candidateNotification/eventHandlers/handleProjectCertificateGeneratedOrFailed.ts)|




### [ProjectCertificateObsolete](../src/modules/project/events/ProjectCertificateObsolete.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCertificateObsolete.ts) de [project](./PROJECTIONS.md#project)|
||project / [handleProjectCertificateObsolete](../src/modules/project/eventHandlers/handleProjectCertificateObsolete.ts)|




### [ProjectCertificateRegenerated](../src/modules/project/events/ProjectCertificateRegenerated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.addGeneratedCertificate](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCertificate.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCertificateRegenerated.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleProjectCertificateUpdatedOrRegenerated](../src/modules/notification/eventHandlers/handleProjectCertificateUpdatedOrRegenerated.ts)|




### [ProjectCertificateUpdateFailed](../src/modules/project/events/ProjectCertificateUpdateFailed.ts)



|Emetteurs|Récepteurs|
|---|---|




### [ProjectCertificateUpdated](../src/modules/project/events/ProjectCertificateUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateCertificate](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCertificate.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCertificateUpdated.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleProjectCertificateUpdatedOrRegenerated](../src/modules/notification/eventHandlers/handleProjectCertificateUpdatedOrRegenerated.ts)|




### [ProjectClasseGranted](../src/modules/project/events/ProjectClasseGranted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.grantClasse](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectClasseGranted.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectCompletionDueDateCancelled](../src/modules/project/events/ProjectCompletionDueDateCancelled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCompletionDueDateCancelled.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCompletionDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectCompletionDueDateSet](../src/modules/project/events/ProjectCompletionDueDateSet.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.signalerDemandeDelai](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectCompletionDueDateSet.ts) de [project](./PROJECTIONS.md#project)|
|[Project.notify](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCompletionDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectCompletionDueDateSet.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[Project.setCompletionDueDate](../src/modules/project/Project.ts)||
|[Project.moveCompletionDueDate](../src/modules/project/Project.ts)||
|[Project.setNotificationDate](../src/modules/project/Project.ts)||




### [ProjectDCRDueDateCancelled](../src/modules/project/events/ProjectDCRDueDateCancelled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectDCRDueDateCancelled.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectDCRDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectDCRDueDateSet](../src/modules/project/events/ProjectDCRDueDateSet.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.notify](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectDCRDueDateSet.ts) de [project](./PROJECTIONS.md#project)|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectDCRDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[Project.setNotificationDate](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectDCRDueDateSet.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectDCRRemoved](../src/modules/project/events/ProjectDCRRemoved.ts)



|Emetteurs|Récepteurs|
|---|---|
|[removeStep](../src/modules/project/useCases/removeStep.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepRemoved.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectDCRRemoved.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectDCRSubmitted](../src/modules/project/events/ProjectDCRSubmitted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[submitStep](../src/modules/project/useCases/submitStep.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectDCRSubmitted.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepSubmitted.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectDCRSubmitted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectDataCorrected](../src/modules/project/events/ProjectDataCorrected.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.correctData](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectDataCorrected.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectFournisseursUpdated](../src/modules/project/events/ProjectFournisseursUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateFournisseurs](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectFournisseursUpdated.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectGFDueDateCancelled](../src/modules/project/events/ProjectGFDueDateCancelled.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectGFDueDateCancelled.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectGFDueDateSet](../src/modules/project/events/ProjectGFDueDateSet.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateProducteur](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectGFDueDateSet.ts) de [project](./PROJECTIONS.md#project)|
|[Project.notify](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFDueDateCancelled.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFDueDateSet.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
|[Project.setNotificationDate](../src/modules/project/Project.ts)||




### [ProjectGFInvalidated](../src/modules/project/events/ProjectGFInvalidated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateProducteur](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectGFInvalidated.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectGFReminded](../src/modules/project/events/ProjectGFReminded.ts)



|Emetteurs|Récepteurs|
|---|---|
|[relanceGarantiesFinancieres](../src/useCases/relanceGarantiesFinancieres.ts)||




### [ProjectGFRemoved](../src/modules/project/events/ProjectGFRemoved.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.removeGarantiesFinancieres](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepRemoved.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFRemoved.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectGFSubmitted](../src/modules/project/events/ProjectGFSubmitted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.submitGarantiesFinancieres](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepSubmitted.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFSubmitted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||notification / [handleProjectGFSubmitted](../src/modules/notification/eventHandlers/handleProjectGFSubmitted.ts)|




### [ProjectGFUploaded](../src/modules/project/events/ProjectGFUploaded.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.uploadGarantiesFinancieres](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepSubmitted.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFUploaded.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectGFWithdrawn](../src/modules/project/events/ProjectGFWithdrawn.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.withdrawGarantiesFinancieres](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepRemoved.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectGFWithdrawn.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectImported](../src/modules/project/events/ProjectImported.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectImported.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectImported.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||authZ / [handleProjectImported](../src/modules/authZ/eventHandlers/handleProjectImported.ts)|
||legacyCandidateNotification / [handleProjectImported](../src/modules/legacyCandidateNotification/eventHandlers/handleProjectImported.ts)|




### [ProjectNewRulesOptedIn](../src/modules/project/events/ProjectNewRulesOptedIn.ts)



|Emetteurs|Récepteurs|
|---|---|
|[updateNewRulesOptIn](../src/modules/project/useCases/updateNewRulesOptIn.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectNewRulesOptedIn.ts) de [project](./PROJECTIONS.md#project)|
||notification / [handleNewRulesOptedIn](../src/modules/notification/eventHandlers/handleNewRulesOptedIn.ts)|




### [ProjectNotificationDateSet](../src/modules/project/events/ProjectNotificationDateSet.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectNotificationDateSet.ts) de [project](./PROJECTIONS.md#project)|
|[Project.setNotificationDate](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectNotificationDateSet.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectNotified](../src/modules/project/events/ProjectNotified.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.notify](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectNotificationDateSet.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectNotified.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectPTFRemoved](../src/modules/project/events/ProjectPTFRemoved.ts)



|Emetteurs|Récepteurs|
|---|---|
|[removeStep](../src/modules/project/useCases/removeStep.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepRemoved.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectPTFRemoved.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectPTFSubmitted](../src/modules/project/events/ProjectPTFSubmitted.ts)



|Emetteurs|Récepteurs|
|---|---|
|[submitStep](../src/modules/project/useCases/submitStep.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepSubmitted.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectPTFSubmitted.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




### [ProjectProducteurUpdated](../src/modules/project/events/ProjectProducteurUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updateProducteur](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectProducteurUpdated.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectPuissanceUpdated](../src/modules/project/events/ProjectPuissanceUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.updatePuissance](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectPuissanceUpdated.ts) de [project](./PROJECTIONS.md#project)|




### [ProjectRawDataImported](../src/modules/project/events/ProjectRawDataImported.ts)



|Emetteurs|Récepteurs|
|---|---|
|[importProjects](../src/modules/project/useCases/importProjects.ts)|project / [handleProjectRawDataImported](../src/modules/project/eventHandlers/handleProjectRawDataImported.ts)|




### [ProjectReimported](../src/modules/project/events/ProjectReimported.ts)



|Emetteurs|Récepteurs|
|---|---|
|[Project.import](../src/modules/project/Project.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectReimported.ts) de [project](./PROJECTIONS.md#project)|
||authZ / [handleProjectImported](../src/modules/authZ/eventHandlers/handleProjectImported.ts)|
||legacyCandidateNotification / [handleProjectImported](../src/modules/legacyCandidateNotification/eventHandlers/handleProjectImported.ts)|




### [ProjectStepStatusUpdated](../src/modules/project/events/ProjectStepStatusUpdated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[updateStepStatus](../src/modules/project/useCases/updateStepStatus.ts)|[Mise à jour](../src/infra/sequelize/projections/projectStep/updates/onProjectStepStatusUpdated.ts) de [projectStep](./PROJECTIONS.md#projectstep)|
||[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectStepStatusUpdated.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|




## projectClaim

### [ProjectClaimFailed](../src/modules/projectClaim/events/ProjectClaimFailed.ts)



|Emetteurs|Récepteurs|
|---|---|
|[claimProject](../src/modules/projectClaim/useCases/claimProject.ts)|[Mise à jour](../src/infra/sequelize/projections/userProjectClaims/updates/onProjectClaimFailed.ts) de [userProjectClaims](./PROJECTIONS.md#userprojectclaims)|




### [ProjectClaimed](../src/modules/projectClaim/events/ProjectClaimed.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ProjectClaim.claim](../src/modules/projectClaim/ProjectClaim.ts)|[Mise à jour](../src/infra/sequelize/projectionsNext/projectEvents/updates/onProjectClaimed.ts) de [projectEvents](./PROJECTIONS.md#projectevents)|
||[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectClaimed.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onProjectClaimed.ts) de [userProjects](./PROJECTIONS.md#userprojects)|




### [ProjectClaimedByOwner](../src/modules/projectClaim/events/ProjectClaimedByOwner.ts)



|Emetteurs|Récepteurs|
|---|---|
|[ProjectClaim.claim](../src/modules/projectClaim/ProjectClaim.ts)|[Mise à jour](../src/infra/sequelize/projections/project/updates/onProjectClaimed.ts) de [project](./PROJECTIONS.md#project)|
||[Mise à jour](../src/infra/sequelize/projections/userProjects/updates/onProjectClaimed.ts) de [userProjects](./PROJECTIONS.md#userprojects)|




## legacyCandidateNotification

### [LegacyCandidateNotified](../src/modules/legacyCandidateNotification/events/LegacyCandidateNotified.ts)



|Emetteurs|Récepteurs|
|---|---|
|[LegacyCandidateNotification.notify](../src/modules/legacyCandidateNotification/LegacyCandidateNotification.ts)|users / [handleLegacyCandidateNotified](../src/modules/users/eventHandlers/handleLegacyCandidateNotified.ts)|
||notification / [handleLegacyCandidateNotified](../src/modules/notification/eventHandlers/handleLegacyCandidateNotified.ts)|




## users

### [InvitationRelanceSent](../src/modules/users/events/InvitationRelanceSent.ts)



|Emetteurs|Récepteurs|
|---|---|
|[relanceInvitation](../src/modules/users/useCases/relanceInvitation.ts)||




### [LegacyUserCreated](../src/modules/users/events/LegacyUserCreated.ts)



|Emetteurs|Récepteurs|
|---|---|




### [UserCreated](../src/modules/users/events/UserCreated.ts)



|Emetteurs|Récepteurs|
|---|---|
|[User.create](../src/modules/users/User.ts)|[Mise à jour](../src/infra/sequelize/projections/user/updates/onUserCreated.ts) de [user](./PROJECTIONS.md#user)|
||authZ / [handleUserCreated](../src/modules/authZ/eventHandlers/handleUserCreated.ts)|
||authN / [handleUserCreated](../src/modules/authN/eventHandlers/handleUserCreated.ts)|




## candidateNotification

### [CandidateInformationOfCertificateUpdateFailed](../src/modules/candidateNotification/events/CandidateInformationOfCertificateUpdateFailed.ts)



|Emetteurs|Récepteurs|
|---|---|




### [CandidateInformedOfCertificateUpdate](../src/modules/candidateNotification/events/CandidateInformedOfCertificateUpdate.ts)



|Emetteurs|Récepteurs|
|---|---|




### [CandidateNotifiedForPeriode](../src/modules/candidateNotification/events/CandidateNotifiedForPeriode.ts)



|Emetteurs|Récepteurs|
|---|---|
|[CandidateNotification.notifyCandidateIfReady](../src/modules/candidateNotification/CandidateNotification.ts)|candidateNotification / [handleCandidateNotifiedForPeriode](../src/modules/candidateNotification/eventHandlers/handleCandidateNotifiedForPeriode.ts)|



  
  