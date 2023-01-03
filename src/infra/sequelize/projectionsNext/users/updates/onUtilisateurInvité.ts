import { Users, UsersProjector } from '../users.model'
import { UtilisateurInvité } from '@modules/utilisateur'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default UsersProjector.on(UtilisateurInvité, async (évènement, transaction) => {
  const {
    payload: { email, role, fonction },
  } = évènement
  try {
    await Users.create(
      {
        email,
        role,
        état: 'invité',
        ...(fonction && { fonction }),
      },
      {
        transaction,
      }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UtilisateurInvité`,
        {
          évènement,
          nomProjection: 'Users.UtilisateurInvité',
        },
        error
      )
    )
  }
})
