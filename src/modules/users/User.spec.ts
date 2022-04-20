import { UniqueEntityID } from '@core/domain'
import { EmailAlreadyUsedError, EntityNotFoundError } from '../shared'
import { UserCreated } from './events'
import { makeUser } from './User'

const userId = new UniqueEntityID().toString()
const email = 'test@test.test'
const emailId = new UniqueEntityID(email)

describe('User.create()', () => {
  describe('when user has not been created yet', () => {
    const user = makeUser({
      id: emailId,
    })._unsafeUnwrap()

    it('should emit a UserCreated with a new userId', () => {
      const res = user.create({ fullName: 'name', role: 'porteur-projet', createdBy: 'createdBy' })
      expect(res.isOk()).toBe(true)
      expect(user.pendingEvents).toHaveLength(1)
      const targetEvent = user.pendingEvents[0]
      expect(targetEvent).toBeInstanceOf(UserCreated)
      expect(targetEvent.payload).toMatchObject({
        email,
        fullName: 'name',
        role: 'porteur-projet',
        createdBy: 'createdBy',
      })
      expect(targetEvent.payload.userId).toHaveLength(new UniqueEntityID().toString().length)
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

    it('should emit nothing', () => {
      const res = user.create({ fullName: 'name', role: 'porteur-projet', createdBy: 'createdBy' })
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EmailAlreadyUsedError)
      expect(user.pendingEvents).toHaveLength(0)
    })
  })
})

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
