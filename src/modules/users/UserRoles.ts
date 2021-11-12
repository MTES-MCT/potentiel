export const USER_ROLES = [
  'admin',
  'dgec',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
] as const

export type UserRole = typeof USER_ROLES[number]
