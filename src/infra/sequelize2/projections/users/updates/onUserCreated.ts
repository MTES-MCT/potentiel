import { UserCreated } from '../../../../../modules/users'
import { usersProjection } from '../users'

export default usersProjection.handle(
  UserCreated,
  (User) => async ({ payload: { userId, role, email } }) => {
    await User.create({
      id: userId,
      role,
      fullName: '',
      email,
    })
  }
)
