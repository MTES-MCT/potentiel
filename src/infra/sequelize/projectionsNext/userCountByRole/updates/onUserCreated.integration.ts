import { UniqueEntityID } from '../../../../../core/domain'
import { UserCreated } from '../../../../../modules/users'
import { resetDatabase } from '../../../helpers'
import { UserCountByRole } from '../userCountByRole.model'
import onUserCreated from './onUserCreated'

describe('onUserCreated', () => {
  describe('when first user of role', () => {
    it('should set the count to 1', async () => {
      await resetDatabase()

      await onUserCreated(
        new UserCreated({
          payload: {
            userId: new UniqueEntityID().toString(),
            email: 'email@test.test',
            role: 'admin',
          },
        })
      )

      const countLine = await UserCountByRole.findOne({ where: { role: 'admin' } })

      expect(countLine).not.toBeNull()
      expect(countLine).toMatchObject({
        count: 1,
      })
    })
  })

  describe('when the role counter is already existing', () => {
    it('should increment the counter by 1', async () => {
      await resetDatabase()

      await UserCountByRole.create({ role: 'admin', count: 12 })

      await onUserCreated(
        new UserCreated({
          payload: {
            userId: new UniqueEntityID().toString(),
            email: 'email@test.test',
            role: 'admin',
          },
        })
      )

      const countLine = await UserCountByRole.findOne({ where: { role: 'admin' } })

      expect(countLine).not.toBeNull()
      expect(countLine).toMatchObject({
        count: 13,
      })
    })
  })
})
