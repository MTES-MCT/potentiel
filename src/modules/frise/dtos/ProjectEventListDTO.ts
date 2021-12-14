import { UserRole } from '../../users'

export type ProjectEventDTO =
  | ProjectNotifiedDTO
  | ProjectImportedDTO
  | ProjectCertificateGeneratedDTO
  | ProjectCertificateRegeneratedDTO

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

export type ProjectCertificateGeneratedDTO = {
  type: 'ProjectCertificateGenerated'
  variant: Exclude<UserRole, 'ademe' | 'dreal'>
  date: number
}

export type ProjectCertificateRegeneratedDTO = {
  type: 'ProjectCertificateRegenerated'
  variant: Exclude<UserRole, 'ademe' | 'dreal'>
  date: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
