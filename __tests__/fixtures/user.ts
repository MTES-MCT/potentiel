import { UserRole } from '../../src/entities'

export default function makeFakeUser(overrides) {
  const credentials = {
    firstName: 'Pierre',
    lastName: 'Durand',
    role: UserRole.PorteurProjet
  }

  return {
    ...credentials,
    ...overrides
  }
}
