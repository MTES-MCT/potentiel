import { ForceArrayType } from '../../core/utils'
import { User } from '../../entities'

export const USER_ROLES = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
] as const

export type UserRole = typeof USER_ROLES[number]

export const userIs =
  <PossibleRoles extends UserRole[] | UserRole>(roles: PossibleRoles) =>
  (user: User): user is UserWithRole<PossibleRoles> => {
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles
  }

export const userIsNot =
  <ExcludedRoles extends UserRole[] | UserRole>(roles: ExcludedRoles) =>
  (user: User): user is UserWithoutRole<ExcludedRoles> => {
    return !userIs(roles)(user)
  }

type UserWithRole<PossibleRoles extends UserRole[] | UserRole> = Omit<User, 'role'> & {
  role: ForceArrayType<PossibleRoles>[number]
}

type UserWithoutRole<ExcludedRoles extends UserRole[] | UserRole> = Omit<User, 'role'> & {
  role: Exclude<UserRole, ForceArrayType<ExcludedRoles>[number]>
}
