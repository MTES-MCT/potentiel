import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { getDreals } from './getDreals'

const { User, UserDreal } = models
describe('Sequelize getDreals', () => {
  const userId = new UniqueEntityID().toString()
  const drealId1 = new UniqueEntityID().toString()
  const drealId2 = new UniqueEntityID().toString()

  describe('when there are Dreals', () => {
    beforeAll(async () => {
      await resetDatabase()

      await User.bulkCreate([
        {
          id: userId,
          fullName: 'PorteurName',
          email: 'test@test.test',
          role: 'porteur-projet',
          registeredOn: new Date(123),
        },
      ])

      await User.bulkCreate([
        {
          id: drealId1,
          fullName: 'DrealName',
          email: 'test@test.test',
          role: 'dreal',
          registeredOn: new Date(123),
        },
      ])

      await User.bulkCreate([
        {
          id: drealId2,
          fullName: 'DrealName',
          email: 'test@test.test',
          role: 'dreal',
          registeredOn: new Date(123),
        },
      ])

      await UserDreal.create({
        userId: drealId1,
        dreal: 'Corse',
      })
      await UserDreal.create({
        userId: drealId2,
        dreal: 'Occitanie',
      })
    })
    it('should return dreal users with their regions', async () => {
      const res = await getDreals()
      expect(res).toHaveLength(2)
      expect(res[0]).toMatchObject({
        user: { role: 'dreal', id: drealId1, fullName: 'DrealName', email: 'test@test.test' },
        dreals: ['Corse'],
      })
      expect(res[1]).toMatchObject({
        user: { role: 'dreal', id: drealId2, fullName: 'DrealName', email: 'test@test.test' },
        dreals: ['Occitanie'],
      })
    })
  })

  describe('when there is no dreal', () => {
    beforeAll(async () => {
      await resetDatabase()

      await User.bulkCreate([
        {
          id: userId,
          fullName: 'PorteurName',
          email: 'test@test.test',
          role: 'porteur-projet',
          registeredOn: new Date(123),
        },
      ])
    })
    it('should return null', async () => {
      const res = await getDreals()
      expect(res).toHaveLength(0)
    })
  })
})
