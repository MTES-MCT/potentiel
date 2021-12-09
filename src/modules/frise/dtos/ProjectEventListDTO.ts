import { UserRole } from '../../users'

export type ProjectEventDTO = ProjectNotifiedDTO | ProjectImportedDTO

export type ProjectNotifiedDTO =
  | {
      type: 'ProjectNotified'
      variant: Exclude<UserRole, 'ademe'>
      date: number
    }
  | {
      type: 'ProjectImported'
      variant: 'dgec' | 'admin'
      date: number
    }

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
