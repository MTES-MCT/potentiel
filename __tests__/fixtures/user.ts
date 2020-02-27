export default function makeFakeUser(overrides) {
  const credentials = {
    firstName: 'Pierre',
    lastName: 'Durand',
    role: ENR.UserRole.PorteurProjet
  }

  return {
    ...credentials,
    ...overrides
  }
}
