import type { RequestHandler } from 'express'
import { UserRole } from '../../users'

export interface EnsureRole {
  (roles: UserRole | UserRole[]): RequestHandler
}
