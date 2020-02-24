import makeFakeCredentials from '../../__tests__/fixtures/credentials'
import { makeCredentials } from './'

describe('Credentials entity', () => {
  it('must have an email', () => {
    const credentials = makeFakeCredentials({ email: null })
    expect(() => makeCredentials(credentials)).toThrow(
      'Credentials must have an email.'
    )
  })

  it('must have a hash or password', () => {
    const credentials = { email: 'bla@bla.com', userId: '1' }
    expect(() => makeCredentials(credentials)).toThrow(
      'Credentials must have a password or hash.'
    )
  })

  it('must have a userId', () => {
    const credentials = {
      email: 'bla@bla.com',
      password: 'dummy',
      userId: null
    }
    expect(() => makeCredentials(credentials)).toThrow(
      'Credentials must have a userId.'
    )
  })

  it('must hash the password', () => {
    const credentials = makeCredentials({
      email: 'bla@bla.com',
      password: 'password',
      userId: '1'
    })

    expect(credentials.hash).toBeDefined()
  })
})
