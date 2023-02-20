import { logger } from '@core/utils'
import { DrealUserInvited } from '@modules/authZ'
import { ProjectionEnEchec } from '@modules/shared'
import { UserDreal, UserDrealProjector } from '../userDreal.model'

export default UserDrealProjector.on(DrealUserInvited, async (event, transaction) => {
  const {
    payload: { region, userId },
  } = event

  try {
    await UserDreal.create({ dreal: region, userId }, { transaction })
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement DrealUserInvited`,
        {
          évènement: event,
          nomProjection: 'UserDreal.DrealUserInvited',
        },
        error
      )
    )
  }
})
