export default function buildMakeUser() {
  return function makeUser({
    firstName,
    lastName,
    role,
    id
  }: {
    firstName: string
    lastName: string
    role: ENR.UserRole
    id?: number
  }): ENR.User {
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
