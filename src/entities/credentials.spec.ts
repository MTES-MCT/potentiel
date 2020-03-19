import { makeCredentials } from './'

describe('Credentials entity', () => {
  it('must hash the password', () => {
    const credentialsResult = makeCredentials({
      email: 'bla@bla.com',
      password: 'password',
      userId: '1'
    })

    expect(credentialsResult.is_ok())
    if (!credentialsResult.is_ok()) return

    const credentials = credentialsResult.unwrap()

    expect(credentials.hash).toBeDefined()
    expect(credentials.hash).not.toContainEqual('password')
  })
})
