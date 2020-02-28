import { makeCredentials } from './'

describe('Credentials entity', () => {
  it('must hash the password', () => {
    const credentials = makeCredentials({
      email: 'bla@bla.com',
      password: 'password',
      userId: '1'
    })

    expect(credentials.hash).toBeDefined()
    expect(credentials.hash).not.toContainEqual('password')
  })
})
