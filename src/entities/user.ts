export type UserRole = 'admin' | 'dgec' | 'porteur-projet'

export type User = {
  readonly firstName: string
  readonly lastName: string
  readonly role: UserRole
  readonly id?: number
}

interface MakeUserProps {
  firstName: string
  lastName: string
  role: UserRole
  id?: number
}

export default function buildMakeUser() {
  return function makeUser({
    firstName,
    lastName,
    role,
    id
  }: MakeUserProps): User {
    // MakeUserProps definition prevents omitting required fields
    return {
      firstName,
      lastName,
      role,
      id
    }
  }
}
