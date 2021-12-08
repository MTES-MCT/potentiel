import { UserRole } from '../../users'

export type ProjectEventDTO = {
  type: 'ProjectImported'
  variant: UserRole
  payload: undefined
  date: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
