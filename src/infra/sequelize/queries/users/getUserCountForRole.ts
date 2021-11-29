import { UserRole } from '../../../../modules/users'
import { UserCountByRole } from '../../projectionsNext'

export const getUserCountForRole = async (role: UserRole) => {
  const roleLine = await UserCountByRole.findOne({ where: { role } })

  if (roleLine === null) return 0

  return roleLine.get().count
}
