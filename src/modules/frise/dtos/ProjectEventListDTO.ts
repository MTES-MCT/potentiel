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

export type ProjectNotifiedDTO = {
  type: 'ProjectNotified'
  variant: Exclude<UserRole, 'ademe'>
  date: number
}

export type ProjectImportedDTO = {
  type: 'ProjectImported'
  variant: 'dgec' | 'admin'
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
  gfDate: number
}

export type ProjectGFDueDateSetDTO = {
  type: 'ProjectGFDueDateSet'
  date: number
  variant: Exclude<UserRole, 'ademe'>
  garantiesFinancieresDueOn: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
