import { UniqueEntityID } from '../../../../../core/domain'
import { UserCreated } from '../../../../../modules/users'
import { resetDatabase } from '../../../../sequelize/helpers'
import { usersProjection } from '../users'
import onUserCreated from './onUserCreated'

describe('onUserCreated', () => {
  it('should create a new user', async () => {
    const userId = new UniqueEntityID().toString()
    await resetDatabase()

    await onUserCreated(
      new UserCreated({
        payload: {
          userId,
          email: 'email@ts',
          role: 'admin',
        },
      })
    )

    const user = await usersProjection.model.findByPk(userId)
    expect(user).not.toBe(null)
  })
})
