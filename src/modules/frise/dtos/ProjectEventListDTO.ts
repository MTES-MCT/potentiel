import { UserRole } from '../../users'

export type ProjectEventDTO = {
  type: 'ProjectNotified'
  variant: Exclude<UserRole, 'ademe'>
  payload: undefined
  date: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
