import { Users, UsersProjector } from '../users.model'
import { ProfilUtilisateurCréé } from '@modules/utilisateur'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default UsersProjector.on(ProfilUtilisateurCréé, async (évènement, transaction) => {
  const { payload } = évènement
  try {
    await Users.upsert(
      {
        ...payload,
        état: 'créé',
      },
      {
        transaction,
      }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProfilUtilisateurCréé`,
        {
          évènement,
          nomProjection: 'Users.ProfilUtilisateurCréé',
        },
        error
      )
    )
  }
})
