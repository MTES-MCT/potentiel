export default function makeFakeUser(overrides?) {
  const defaultObj = {
    fullName: 'Pierre Durand',
    role: 'admin',
    email: 'fake@email.com',
    isRegistered: true,
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
