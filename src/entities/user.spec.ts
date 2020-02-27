import makeFakeUser from '../../__tests__/fixtures/user'
import { makeUser } from './'

describe('User entity', () => {
  it('must have a firstName', () => {
    const user = makeFakeUser({ firstName: null })
    expect(() => makeUser(user)).toThrow('User must have a first name.')
  })

  it('must have a lastName', () => {
    const user = makeFakeUser({ lastName: null })
    expect(() => makeUser(user)).toThrow('User must have a last name.')
  })

  it('must have a role', () => {
    const user = makeFakeUser({ role: null })
    expect(() => makeUser(user)).toThrow('User must have a role.')
  })
})
