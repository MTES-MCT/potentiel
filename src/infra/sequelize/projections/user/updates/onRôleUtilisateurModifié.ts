import { RôleUtilisateurModifié } from '@modules/users'
import { userProjector } from '../user.model'

export const onRôleUtilisateurModifié = userProjector.on(RôleUtilisateurModifié).update({
  where: ({ payload: { userId } }) => ({ id: userId }),
  delta: ({ payload: { role } }) => ({ role }),
})
