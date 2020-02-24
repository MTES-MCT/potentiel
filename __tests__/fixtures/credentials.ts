import hashFn from '../../src/helpers/hashPassword'

export default function makeFakeCredentials(overrides) {
  const credentials = {
    email: 'test@example.com',
    userId: 'abcd',
    hash: hashFn('password')
  }

  if (overrides && overrides.password) {
    credentials.hash = hashFn(overrides.password)
  }

  return {
    ...credentials,
    ...overrides,
    password: undefined
  }
}
