import { Users, UsersProjector } from '../users.model'
import { RôleUtilisateurModifié } from '@modules/users'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default UsersProjector.on(RôleUtilisateurModifié, async (évènement, transaction) => {
  const {
    payload: { userId, role },
  } = évènement
  try {
    await Users.update(
      {
        role,
      },
      {
        where: { id: userId },
        transaction,
      }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement RôleUtilisateurModifié`,
        {
          évènement,
          nomProjection: 'Users.RôleUtilisateurModifié',
        },
        error
      )
    )
  }
})
