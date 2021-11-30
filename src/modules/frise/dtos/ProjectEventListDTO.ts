import { UserRole } from '../../users'

export type ProjectEventDTO = {
  type: 'creation'
  variant: UserRole
  payload: undefined
  date: number
}

export type ProjectEventListDTO = { events: ProjectEventDTO[] }
