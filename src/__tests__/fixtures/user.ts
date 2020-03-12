export default function makeFakeUser(overrides?) {
  const defaultObj = {
    firstName: 'Pierre',
    lastName: 'Durand',
    role: 'admin'
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
