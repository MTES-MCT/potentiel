import { UserRole } from '../../users'

export type ProjectEventDTO = ProjectNotifiedDTO

export type ProjectNotifiedDTO = {
  type: 'ProjectNotified'
  variant: Exclude<UserRole, 'ademe'>
  date: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
