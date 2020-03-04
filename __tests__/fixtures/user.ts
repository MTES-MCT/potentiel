import { UserRole } from '../../src/entities'

export default function makeFakeUser(overrides) {
  const credentials = {
    firstName: 'Pierre',
    lastName: 'Durand',
    role: 'admin'
  }

  return {
    ...credentials,
    ...overrides
  }
}
