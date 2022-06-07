
# Projections

Les projections sont les tables de base de données qui représentent un état à date.
Elles sont mises à jour par les différents [événements](./EVENTS.md).

Les données qui sont affichées dans les vues sont issues de ces projections.

## Sommaire

- [appelOffre](#appeloffre)
- [modificationRequest](#modificationrequest)
- [project](#project)
- [projectEvents](#projectevents)
- [projectStep](#projectstep)
- [user](#user)
- [userDreal](#userdreal)
- [userProjectClaims](#userprojectclaims)
- [userProjects](#userprojects)


## Projections


### appelOffre
Mise à jour par:
- [AppelOffreCreated](./Events.md#appeloffrecreated)

- [AppelOffreRemoved](./Events.md#appeloffreremoved)

- [AppelOffreUpdated](./Events.md#appeloffreupdated)

- [PeriodeCreated](./Events.md#periodecreated)

- [PeriodeUpdated](./Events.md#periodeupdated)


### modificationRequest
Mise à jour par:
- [ConfirmationRequested](./Events.md#confirmationrequested)

- [LegacyModificationImported](./Events.md#legacymodificationimported)

- [ModificationReceived](./Events.md#modificationreceived)

- [ModificationRequestAccepted](./Events.md#modificationrequestaccepted)

- [ModificationRequestCancelled](./Events.md#modificationrequestcancelled)

- [ModificationRequestConfirmed](./Events.md#modificationrequestconfirmed)

- [ModificationRequestInstructionStarted](./Events.md#modificationrequestinstructionstarted)

- [ModificationRequestRejected](./Events.md#modificationrequestrejected)

- [ModificationRequestStatusUpdated](./Events.md#modificationrequeststatusupdated)

- [ModificationRequested](./Events.md#modificationrequested)


### project
Mise à jour par:
- [CovidDelayGranted](./Events.md#coviddelaygranted)

- [NumeroGestionnaireSubmitted](./Events.md#numerogestionnairesubmitted)

- [ProjectAbandoned](./Events.md#projectabandoned)

- [ProjectActionnaireUpdated](./Events.md#projectactionnaireupdated)

- [ProjectCertificateGenerated](./Events.md#projectcertificategenerated)

- [ProjectCertificateObsolete](./Events.md#projectcertificateobsolete)

- [ProjectCertificateRegenerated](./Events.md#projectcertificateregenerated)

- [ProjectCertificateUpdated](./Events.md#projectcertificateupdated)

- [ProjectClasseGranted](./Events.md#projectclassegranted)

- [ProjectCompletionDueDateCancelled](./Events.md#projectcompletionduedatecancelled)

- [ProjectCompletionDueDateSet](./Events.md#projectcompletionduedateset)

- [ProjectDCRDueDateCancelled](./Events.md#projectdcrduedatecancelled)

- [ProjectDCRDueDateSet](./Events.md#projectdcrduedateset)

- [ProjectDCRSubmitted](./Events.md#projectdcrsubmitted)

- [ProjectDataCorrected](./Events.md#projectdatacorrected)

- [ProjectFournisseursUpdated](./Events.md#projectfournisseursupdated)

- [ProjectGFDueDateCancelled](./Events.md#projectgfduedatecancelled)

- [ProjectGFDueDateSet](./Events.md#projectgfduedateset)

- [ProjectGFInvalidated](./Events.md#projectgfinvalidated)

- [ProjectImported](./Events.md#projectimported)

- [ProjectNewRulesOptedIn](./Events.md#projectnewrulesoptedin)

- [ProjectNotificationDateSet](./Events.md#projectnotificationdateset)

- [ProjectNotified](./Events.md#projectnotified)

- [ProjectProducteurUpdated](./Events.md#projectproducteurupdated)

- [ProjectPuissanceUpdated](./Events.md#projectpuissanceupdated)

- [ProjectReimported](./Events.md#projectreimported)

- [ProjectClaimed](./Events.md#projectclaimed)

- [ProjectClaimedByOwner](./Events.md#projectclaimedbyowner)


### projectEvents
Mise à jour par:
- [ConfirmationRequested](./Events.md#confirmationrequested)

- [LegacyModificationImported](./Events.md#legacymodificationimported)

- [ModificationReceived](./Events.md#modificationreceived)

- [ModificationRequestAccepted](./Events.md#modificationrequestaccepted)

- [ModificationRequestCancelled](./Events.md#modificationrequestcancelled)

- [ModificationRequestConfirmed](./Events.md#modificationrequestconfirmed)

- [ModificationRequestInstructionStarted](./Events.md#modificationrequestinstructionstarted)

- [ModificationRequestRejected](./Events.md#modificationrequestrejected)

- [ModificationRequested](./Events.md#modificationrequested)

- [FileAttachedToProject](./Events.md#fileattachedtoproject)

- [FileDetachedFromProject](./Events.md#filedetachedfromproject)

- [CovidDelayGranted](./Events.md#coviddelaygranted)

- [DemandeAbandonSignaled](./Events.md#demandeabandonsignaled)

- [DemandeDelaiSignaled](./Events.md#demandedelaisignaled)

- [DemandeRecoursSignaled](./Events.md#demanderecourssignaled)

- [ProjectCertificateGenerated](./Events.md#projectcertificategenerated)

- [ProjectCertificateRegenerated](./Events.md#projectcertificateregenerated)

- [ProjectCertificateUpdated](./Events.md#projectcertificateupdated)

- [ProjectCompletionDueDateCancelled](./Events.md#projectcompletionduedatecancelled)

- [ProjectCompletionDueDateSet](./Events.md#projectcompletionduedateset)

- [ProjectCompletionDueDateSet](./Events.md#projectcompletionduedateset)

- [ProjectDCRDueDateCancelled](./Events.md#projectdcrduedatecancelled)

- [ProjectDCRDueDateSet](./Events.md#projectdcrduedateset)

- [ProjectDCRDueDateSet](./Events.md#projectdcrduedateset)

- [ProjectDCRRemoved](./Events.md#projectdcrremoved)

- [ProjectDCRSubmitted](./Events.md#projectdcrsubmitted)

- [ProjectGFDueDateCancelled](./Events.md#projectgfduedatecancelled)

- [ProjectGFDueDateSet](./Events.md#projectgfduedateset)

- [ProjectGFDueDateSet](./Events.md#projectgfduedateset)

- [ProjectGFRemoved](./Events.md#projectgfremoved)

- [ProjectGFSubmitted](./Events.md#projectgfsubmitted)

- [ProjectGFUploaded](./Events.md#projectgfuploaded)

- [ProjectGFWithdrawn](./Events.md#projectgfwithdrawn)

- [ProjectImported](./Events.md#projectimported)

- [ProjectNotificationDateSet](./Events.md#projectnotificationdateset)

- [ProjectNotified](./Events.md#projectnotified)

- [ProjectPTFRemoved](./Events.md#projectptfremoved)

- [ProjectPTFSubmitted](./Events.md#projectptfsubmitted)

- [ProjectStepStatusUpdated](./Events.md#projectstepstatusupdated)

- [ProjectClaimed](./Events.md#projectclaimed)

- [LegacyModificationFileAttached](./Events.md#legacymodificationfileattached)


### projectStep
Mise à jour par:
- [ProjectDCRRemoved](./Events.md#projectdcrremoved)

- [ProjectDCRSubmitted](./Events.md#projectdcrsubmitted)

- [ProjectGFRemoved](./Events.md#projectgfremoved)

- [ProjectGFSubmitted](./Events.md#projectgfsubmitted)

- [ProjectGFUploaded](./Events.md#projectgfuploaded)

- [ProjectGFWithdrawn](./Events.md#projectgfwithdrawn)

- [ProjectPTFRemoved](./Events.md#projectptfremoved)

- [ProjectPTFSubmitted](./Events.md#projectptfsubmitted)

- [ProjectStepStatusUpdated](./Events.md#projectstepstatusupdated)


### user
Mise à jour par:
- [UserCreated](./Events.md#usercreated)


### userDreal
Mise à jour par:
- [DrealUserInvited](./Events.md#drealuserinvited)


### userProjectClaims
Mise à jour par:
- [ProjectClaimFailed](./Events.md#projectclaimfailed)


### userProjects
Mise à jour par:
- [UserInvitedToProject](./Events.md#userinvitedtoproject)

- [UserProjectsLinkedByContactEmail](./Events.md#userprojectslinkedbycontactemail)

- [UserRightsToProjectGranted](./Events.md#userrightstoprojectgranted)

- [UserRightsToProjectRevoked](./Events.md#userrightstoprojectrevoked)

- [ProjectClaimed](./Events.md#projectclaimed)

- [ProjectClaimedByOwner](./Events.md#projectclaimedbyowner)

  
  