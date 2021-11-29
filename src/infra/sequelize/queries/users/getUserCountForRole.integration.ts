import { resetDatabase } from '../../helpers'
import { UserCountByRole } from '../../projectionsNext'
import { getUserCountForRole } from './getUserCountForRole'

describe('getUserCountForRole', () => {
  describe('when there is a count for this role', () => {
    it('should return the user count for the given role', async () => {
      await resetDatabase()

      await UserCountByRole.create({ role: 'admin', count: 12 })
      await UserCountByRole.create({ role: 'dreal', count: 1 })

      const adminCount = await getUserCountForRole('admin')

      expect(adminCount).toEqual(12)
    })
  })

  describe('when there is no count for this role', () => {
    it('should return 0', async () => {
      await resetDatabase()

      await UserCountByRole.create({ role: 'admin', count: 12 })

      const drealCount = await getUserCountForRole('dreal')

      expect(drealCount).toEqual(0)
    })
  })
})
