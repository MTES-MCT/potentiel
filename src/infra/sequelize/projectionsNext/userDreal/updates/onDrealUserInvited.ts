import { DrealUserInvited } from '@modules/authZ'
import { UserDrealProjector } from '../userDreal.model'

export default UserDrealProjector.on(DrealUserInvited, async (event) => {
  return Promise.reject()
})
// .create(({ payload: { region, userId } }) => ({
//   userId,
//   dreal: region,
// }))
