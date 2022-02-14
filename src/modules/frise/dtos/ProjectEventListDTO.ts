import { or } from '@core/utils'
import { Project } from '@entities'
import { UserRole } from '../../users'

export type ProjectEventDTO =
  | ProjectNotifiedDTO
  | ProjectImportedDTO
  | ProjectCertificateGeneratedDTO
  | ProjectCertificateRegeneratedDTO
  | ProjectCertificateUpdatedDTO
  | ProjectClaimedDTO
  | ProjectGFSubmittedDTO
  | ProjectGFRemovedDTO
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

type File = {
  id: string
  name: string
}

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
  | { variant: 'porteur-projet' | 'acheteur-obligé'; email: undefined }
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
} & {
  modificationType: 'delai'
  delayInMonths: number
}

export type ModificationRequestAcceptedDTO = {
  type: 'ModificationRequestAccepted'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  modificationRequestId: string
  file?: File
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

export type ModificationRequestDTO =
  | ModificationRequestedDTO
  | ModificationRequestAcceptedDTO
  | ModificationRequestRejectedDTO
  | ModificationRequestInstructionStartedDTO
  | ModificationRequestCancelledDTO

export type ProjectEventListDTO = {
  project: { id: Project['id']; isLaureat: boolean }
  events: ProjectEventDTO[]
}
