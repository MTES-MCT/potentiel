import { UserCreated } from '../../../../../modules/users'
import { User } from '../user.model'

export default User.projector!.handle(UserCreated, async ({ payload: { userId, role, email } }) => {
  await User.create({
    id: userId,
    role,
    fullName: '',
    email,
  })
})
