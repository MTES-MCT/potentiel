import { Users, UsersProjector } from '../users.model'
import { UserCreated } from '@modules/users'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default UsersProjector.on(UserCreated, async (évènement, transaction) => {
  const {
    payload: { userId, email, role, fullName },
  } = évènement
  try {
    await Users.create(
      {
        id: userId,
        email,
        role,
        fullName,
      },
      {
        transaction,
      }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UserCreated`,
        {
          évènement,
          nomProjection: 'Users.UserCreated',
        },
        error
      )
    )
  }
})
