import { UniqueEntityID } from '../../core/domain'
import { EntityNotFoundError } from '../shared'
import { UserCreated, UserRegistered } from './events'
import { makeUser } from './User'

const userId = new UniqueEntityID().toString()
const email = 'test@test.test'
const emailId = new UniqueEntityID(email)

describe('User.getUserId()', () => {
  describe('when user has not been created yet', () => {
    const user = makeUser({
      id: emailId,
    })._unsafeUnwrap()

    it('should return a EntityNotFoundError', () => {
      expect(user.getUserId()._unsafeUnwrapErr()).toEqual(new EntityNotFoundError())
    })
  })

  describe('when user has been created', () => {
    const user = makeUser({
      id: emailId,
      events: [
        new UserCreated({
          payload: {
            email,
            userId,
            fullName: 'name',
            role: 'porteur-projet',
          },
        }),
      ],
    })._unsafeUnwrap()

    it('should return the userId', () => {
      expect(user.getUserId()._unsafeUnwrap()).toEqual(userId)
    })
  })
})

describe('User.registerFirstLogin()', () => {
  describe('when user is not registered yet', () => {
    const user = makeUser({
      id: emailId,
      events: [
        new UserCreated({
          payload: {
            userId,
            email,
            role: 'porteur-projet',
          },
        }),
      ],
    })._unsafeUnwrap()

    it('should emit UserRegistered', () => {
      const res = user.registerFirstLogin({ fullName: 'full name', email })

      expect(res.isOk()).toBe(true)

      expect(user.pendingEvents).toHaveLength(1)
      const event = user.pendingEvents[0]
      expect(event).toBeInstanceOf(UserRegistered)
      expect(event.payload).toMatchObject({
        userId,
        fullName: 'full name',
      })
    })
  })

  describe('when user is already registered', () => {
    const user = makeUser({
      id: emailId,
      events: [
        new UserCreated({
          payload: {
            userId,
            email,
            role: 'porteur-projet',
          },
        }),
        new UserRegistered({
          payload: {
            userId,
            fullName: 'full name',
            email,
          },
        }),
      ],
    })._unsafeUnwrap()

    it('should not emit', () => {
      const res = user.registerFirstLogin({ fullName: 'full name', email })

      expect(res.isOk()).toBe(true)

      expect(user.pendingEvents).toHaveLength(0)
    })
  })
})
