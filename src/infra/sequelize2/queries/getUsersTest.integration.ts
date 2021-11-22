import { UniqueEntityID } from '../../../core/domain'
import { resetDatabase } from '../../sequelize/helpers'
import { usersProjection } from '../projections'
import { getUsersTest } from './getUsersTest'

describe('getUsersTest', () => {
  it('should return all users', async () => {
    const userId = new UniqueEntityID().toString()

    await resetDatabase()

    await usersProjection.model.create({ id: userId, fullName: '', role: 'admin', email: 'email' })

    expect(await getUsersTest()).toHaveLength(1)
  })
})
