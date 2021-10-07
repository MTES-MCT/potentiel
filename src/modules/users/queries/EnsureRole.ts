import type { RequestHandler } from 'express'
import { User } from '../../../entities'

export interface EnsureRole {
  (roles: User['role'] | User['role'][]): RequestHandler
}
