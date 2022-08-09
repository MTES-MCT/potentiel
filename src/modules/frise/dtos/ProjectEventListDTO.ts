import { or } from '@core/utils'
import { Project } from '@entities'
import { LegacyModificationStatus } from '@modules/modificationRequest'
import { Fournisseur } from '@modules/project'
import { UserRole } from '../../users'

export type ProjectEventDTO =
  | ProjectNotifiedDTO
  | ProjectImportedDTO
  | ProjectCertificateGeneratedDTO
  | ProjectCertificateRegeneratedDTO
  | ProjectCertificateUpdatedDTO
  | ProjectClaimedDTO
  | ProjectGFSubmittedDTO
  | ProjectGFUploadedDTO
  | ProjectGFRemovedDTO
  | ProjectGFWithdrawnDTO
  | ProjectGFDueDateSetDTO
  | ProjectGFValidatedDTO
  | ProjectGFInvalidatedDTO
  | ProjectDCRSubmittedDTO
  | ProjectDCRRemovedDTO
  | ProjectDCRDueDateSetDTO
  | ProjectPTFSubmittedDTO
  | ProjectPTFRemovedDTO
  | ProjectNotificationDateSetDTO
  | ProjectCompletionDueDateSetDTO
  | ModificationRequestedDTO
  | ModificationRequestAcceptedDTO
  | ModificationRequestCancelledDTO
  | ModificationRequestRejectedDTO
  | ModificationRequestInstructionStartedDTO
  | ConfirmationRequestedDTO
  | ModificationRequestConfirmedDTO
  | ModificationReceivedDTO
  | LegacyModificationImportedDTO
  | FileAttachedToProjectDTO
  | LegacyModificationFileAttachedDTO
  | CovidDelayGrantedDTO
  | DemandeDelaiSignaledDTO
  | DemandeAbandonSignaledDTO
  | DemandeRecoursSignaledDTO
  | DemandeDélaiDTO

type File = {
  id: string
  name: string
}

export type ProjectStatus = 'Classé' | 'Eliminé' | 'Abandonné'

type NarrowDTOType<T, N> = T extends { type: N } ? T : never

export const is =
  <T extends ProjectEventDTO, K extends T['type']>(type: K) =>
  (event: ProjectEventDTO): event is NarrowDTOType<T, K> =>
    event.type === type

export type ProjectNotifiedDTO = {
  type: 'ProjectNotified'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  isLegacy?: true
}

export type ProjectImportedDTO = {
  type: 'ProjectImported'
  variant: 'dgec' | 'admin'
  date: number
}

export type ProjectNotificationDateSetDTO = {
  type: 'ProjectNotificationDateSet'
  variant: Exclude<UserRole, 'ademe'>
  date: number
}

type ProjectCertificateBase = {
  date: number
  potentielIdentifier: string
  certificateFileId: string
  nomProjet: string
} & (
  | { variant: 'admin' | 'dgec'; email: string }
  | { variant: 'porteur-projet' | 'acheteur-obligé' | 'dreal'; email: undefined }
)

export type ProjectCertificateGeneratedDTO = ProjectCertificateBase & {
  type: 'ProjectCertificateGenerated'
}

export type ProjectCertificateRegeneratedDTO = ProjectCertificateBase & {
  type: 'ProjectCertificateRegenerated'
}

export type ProjectCertificateUpdatedDTO = ProjectCertificateBase & {
  type: 'ProjectCertificateUpdated'
}

export type ProjectClaimedDTO = ProjectCertificateBase & {
  type: 'ProjectClaimed'
  claimedBy: string
}

export type ProjectCertificateDTO =
  | ProjectCertificateGeneratedDTO
  | ProjectCertificateRegeneratedDTO
  | ProjectCertificateUpdatedDTO
  | ProjectClaimedDTO

export const isCertificateDTO = or(
  is('ProjectCertificateGenerated'),
  is('ProjectCertificateRegenerated'),
  is('ProjectCertificateUpdated'),
  is('ProjectClaimed')
)

export type ProjectGFSubmittedDTO = {
  type: 'ProjectGFSubmitted'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  file?: File
  expirationDate?: number
}

export type ProjectGFUploadedDTO = {
  type: 'ProjectGFUploaded'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  file?: { id: string; name: string }
  expirationDate?: number
  uploadedByRole: 'porteur-projet' | 'dreal'
}

export type ProjectGFDueDateSetDTO = {
  type: 'ProjectGFDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}

export type ProjectGFRemovedDTO = {
  type: 'ProjectGFRemoved'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
}

export type ProjectGFWithdrawnDTO = {
  type: 'ProjectGFWithdrawn'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
}

export type ProjectGFValidatedDTO = {
  type: 'ProjectGFValidated'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
}

export type ProjectGFInvalidatedDTO = {
  type: 'ProjectGFInvalidated'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
}

export type ProjectDCRSubmittedDTO = {
  type: 'ProjectDCRSubmitted'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  file?: File
  numeroDossier: string
}

export type ProjectDCRRemovedDTO = {
  type: 'ProjectDCRRemoved'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  removedBy: string
}

export type ProjectDCRDueDateSetDTO = {
  type: 'ProjectDCRDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}

export type ProjectPTFSubmittedDTO = {
  type: 'ProjectPTFSubmitted'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  file?: File
}

export type ProjectPTFRemovedDTO = {
  type: 'ProjectPTFRemoved'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  removedBy: string
}

export type ProjectCompletionDueDateSetDTO = {
  type: 'ProjectCompletionDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}

export type ModificationRequestedDTO = {
  type: 'ModificationRequested'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
  authority: 'dgec' | 'dreal'
} & (
  | {
      modificationType: 'delai'
      delayInMonths: number
    }
  | {
      modificationType: 'puissance'
      puissance: number
      unitePuissance?: string
    }
  | { modificationType: 'abandon' | 'recours' }
)

export type ModificationRequestAcceptedDTO = {
  type: 'ModificationRequestAccepted'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
  file?: File
  delayInMonthsGranted?: number
}

export type ModificationRequestRejectedDTO = {
  type: 'ModificationRequestRejected'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
  file?: File
}

export type ModificationRequestInstructionStartedDTO = {
  type: 'ModificationRequestInstructionStarted'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
}

export type ModificationRequestCancelledDTO = {
  type: 'ModificationRequestCancelled'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
}

export type ConfirmationRequestedDTO = {
  type: 'ConfirmationRequested'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
  file?: File
}

export type ModificationRequestConfirmedDTO = {
  type: 'ModificationRequestConfirmed'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
}

export type ModificationRequestDTO =
  | ModificationRequestedDTO
  | ModificationRequestAcceptedDTO
  | ModificationRequestRejectedDTO
  | ModificationRequestInstructionStartedDTO
  | ModificationRequestCancelledDTO
  | ConfirmationRequestedDTO
  | ModificationRequestConfirmedDTO

export type ModificationReceivedDTO = {
  type: 'ModificationReceived'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
} & (
  | { modificationType: 'actionnaire'; actionnaire: string }
  | { modificationType: 'producteur'; producteur: string }
  | { modificationType: 'fournisseur'; fournisseurs: Fournisseur[] }
  | { modificationType: 'puissance'; puissance: number; unitePuissance?: string }
)

export type LegacyModificationImportedDTO = {
  type: 'LegacyModificationImported'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  status: LegacyModificationStatus
  filename?: string
} & (
  | { modificationType: 'abandon' }
  | { modificationType: 'recours'; motifElimination: string }
  | {
      modificationType: 'delai'
      status: Extract<LegacyModificationStatus, 'acceptée'>
      ancienneDateLimiteAchevement: number
      nouvelleDateLimiteAchevement: number
    }
  | {
      modificationType: 'delai'
      status: Extract<LegacyModificationStatus, 'rejetée' | 'accord-de-principe'>
    }
  | { modificationType: 'actionnaire'; actionnairePrecedent: string }
  | { modificationType: 'producteur'; producteurPrecedent: string }
  | { modificationType: 'autre'; column: string; value: string }
)

export type LegacyModificationFileAttachedDTO = {
  type: 'LegacyModificationFileAttached'
  variant: UserRole
  file: File
}

export type FileAttachedToProjectDTO = {
  type: 'FileAttachedToProject'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  title: string
  description?: string
  files: File[]
  isOwner: boolean
  attachmentId: string
  projectId: string
  attachedBy: {
    id: string
    name?: string
    administration?: string
  }
}

export type CovidDelayGrantedDTO = {
  type: 'CovidDelayGranted'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}

export type DemandeDelaiSignaledDTO = {
  type: 'DemandeDelaiSignaled'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  signaledBy: string
  attachment?: File
  notes?: string
} & (
  | {
      status: 'acceptée'
      oldCompletionDueOn?: number
      newCompletionDueOn: number
    }
  | {
      status: 'rejetée' | 'accord-de-principe'
    }
)

export type DemandeAbandonSignaledDTO = {
  type: 'DemandeAbandonSignaled'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  signaledBy: string
  status: 'acceptée' | 'rejetée' | 'à accorder'
  attachment?: File
  notes?: string
}

export type DemandeRecoursSignaledDTO = {
  type: 'DemandeRecoursSignaled'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  signaledBy: string
  status: 'acceptée' | 'rejetée'
  attachment?: File
  notes?: string
}

export type DemandeDélaiDTO = {
  type: 'DemandeDélai'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  demandeUrl?: string
  actionRequise?: 'à traiter' | 'réponse à envoyer'
} & (
  | { dateAchèvementDemandée: string; délaiEnMoisDemandé?: undefined }
  | { dateAchèvementDemandée?: undefined; délaiEnMoisDemandé: number }
) &
  (
    | { statut: 'envoyée' | 'annulée' | 'rejetée' | 'en-instruction' }
    | ({
        statut: 'accordée'
      } & (
        | {
            délaiEnMoisAccordé?: undefined
            dateAchèvementAccordée: string
            ancienneDateThéoriqueAchèvement: string
          }
        | {
            délaiEnMoisAccordé: number
            dateAchèvementAccordée?: undefined
            ancienneDateThéoriqueAchèvement?: undefined
          }
      ))
  )

export type ProjectEventListDTO = {
  project: {
    id: Project['id']
    status: ProjectStatus
    isSoumisAuxGF?: boolean
    isGarantiesFinancieresDeposeesALaCandidature?: boolean
  }
  events: ProjectEventDTO[]
}
