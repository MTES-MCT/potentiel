import { UniqueEntityID } from '@core/domain'
import { UtilisateurInvité } from '@modules/utilisateur'
import { userProjector } from '../user.model'

export const onUtilisateurInvité = userProjector
  .on(UtilisateurInvité)
  .create(({ payload: { email, role } }) => ({
    id: new UniqueEntityID(),
    email,
    role,
    fullName: '',
    statut: 'invité',
  }))
