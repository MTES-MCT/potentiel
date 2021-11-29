import { UserCreated } from '../../../../../modules/users'
import { UserCountByRole } from '../userCountByRole.model'

export default UserCountByRole.projector.on(UserCreated, async ({ payload: { role } }) => {
  const userCountByRole = await UserCountByRole.findOne({ where: { role } })

  if (userCountByRole) {
    userCountByRole.increment('count')
    await userCountByRole.save()
  } else {
    await UserCountByRole.create({ role, count: 1 })
  }
})
