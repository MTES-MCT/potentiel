export default function makeFakeUser(overrides?) {
  const defaultObj = {
    firstName: 'Pierre',
    lastName: 'Durand',
    role: 'admin',
    email: 'fake@email.com',
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
