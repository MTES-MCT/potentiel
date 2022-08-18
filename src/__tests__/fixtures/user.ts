export default function makeFakeUser(overrides?) {
  const defaultObj = {
    fullName: 'Pierre Durand',
    role: 'admin',
    email: 'fake@email.com',
    fonction: undefined,
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
