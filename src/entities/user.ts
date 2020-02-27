export const enum UserRole {
  Admin,
  DGEC,
  PorteurProjet
}

export type User = {
  readonly firstName: string
  readonly lastName: string
  readonly role: UserRole
  readonly id?: number
}

interface UserProps {
  firstName: string
  lastName: string
  role: UserRole
  id?: number
}

export default function buildMakeUser() {
  return function makeUser({ firstName, lastName, role, id }: UserProps): User {
    if (!firstName) {
      throw new Error('User must have a first name.')
    }
    if (!lastName) {
      throw new Error('User must have a last name.')
    }
    if (!role) {
      throw new Error('User must have a role.')
    }

    return {
      firstName,
      lastName,
      role,
      id
    }
  }
}
