export default function makeFakeUser(overrides?) {
  const defaultObj = {
    fullName: 'Pierre Durand',
    role: 'admin',
    email: 'fake@email.com',
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
