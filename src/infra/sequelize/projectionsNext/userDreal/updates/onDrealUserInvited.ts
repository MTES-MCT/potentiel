import { DrealUserInvited } from '@modules/authZ'
import { UserDreal, UserDrealProjector } from '../userDreal.model'

export default UserDrealProjector.on(DrealUserInvited, async (event, transaction) => {
  const {
    payload: { region, userId },
  } = event

  await UserDreal.create({ dreal: region, userId })
})
