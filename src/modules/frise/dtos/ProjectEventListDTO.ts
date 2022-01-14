import { UserRole } from '../../users'

export type ProjectEventDTO =
  | ProjectNotifiedDTO
  | ProjectImportedDTO
  | ProjectCertificateGeneratedDTO
  | ProjectCertificateRegeneratedDTO
  | ProjectCertificateUpdatedDTO
  | ProjectClaimedDTO
  | ProjectGFSubmittedDTO
  | ProjectGFDueDateSetDTO
  | ProjectDCRSubmittedDTO
  | ProjectDCRRemovedDTO
  | ProjectDCRDueDateSetDTO

type NarrowDTOType<T, N> = T extends { type: N } ? T : never

export const is = <T extends ProjectEventDTO, K extends T['type']>(type: K) => (
  event: ProjectEventDTO
): event is NarrowDTOType<T, K> => event.type === type

export type ProjectNotifiedDTO = {
  type: 'ProjectNotified'
  variant: Exclude<UserRole, 'ademe'>
  date: number
  isLegacy?: true
}
export const isProjectNotified = (event: ProjectEventDTO): event is ProjectNotifiedDTO =>
  event.type === 'ProjectNotified'

export type ProjectImportedDTO = {
  type: 'ProjectImported'
  variant: 'dgec' | 'admin'
  date: number
}
export const isProjectImported = (event: ProjectEventDTO): event is ProjectImportedDTO =>
  event.type === 'ProjectImported'

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

export const isCertificateDTO = (event: ProjectEventDTO): event is ProjectCertificateDTO =>
  [
    'ProjectCertificateGenerated',
    'ProjectCertificateRegenerated',
    'ProjectCertificateUpdated',
    'ProjectClaimed',
  ].includes(event.type)

export type ProjectGFSubmittedDTO = {
  type: 'ProjectGFSubmitted'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  fileId: string
  filename: string
  submittedBy: string
}
export const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

export type ProjectGFDueDateSetDTO = {
  type: 'ProjectGFDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}
export const isProjectGFDueDateSet = (event: ProjectEventDTO): event is ProjectGFDueDateSetDTO =>
  event.type === 'ProjectGFDueDateSet'

export type ProjectDCRSubmittedDTO = {
  type: 'ProjectDCRSubmitted'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  fileId: string
  filename: string
  submittedBy: string
}
export const isProjectDCRSubmitted = (event: ProjectEventDTO): event is ProjectDCRSubmittedDTO =>
  event.type === 'ProjectDCRSubmitted'

export type ProjectDCRRemovedDTO = {
  type: 'ProjectDCRRemoved'
  date: number
  variant: 'porteur-projet' | 'admin' | 'dgec' | 'dreal'
  removedBy: string
}
export const isProjectDCRRemoved = (event: ProjectEventDTO): event is ProjectDCRRemovedDTO =>
  event.type === 'ProjectDCRRemoved'

export type ProjectDCRDueDateSetDTO = {
  type: 'ProjectDCRDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
}
export const isProjectDCRDueDateSet = (event: ProjectEventDTO): event is ProjectDCRDueDateSetDTO =>
  event.type === 'ProjectDCRDueDateSet'

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
