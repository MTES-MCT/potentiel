import { FonctionUtilisateurModifiée } from '@modules/users'
import { userProjector } from '../user.model'

export const onFonctionUtilisateurModifiée = userProjector.on(FonctionUtilisateurModifiée).update({
  where: ({ payload: { userId } }) => ({ id: userId }),
  delta: ({ payload: { fonction } }) => ({ fonction }),
})
