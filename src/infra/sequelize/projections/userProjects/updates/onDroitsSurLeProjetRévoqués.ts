import { logger } from '@core/utils'
import { DroitsSurLeProjetRévoqués } from '@modules/authZ'

export const onDroitsSurLeProjetRévoqués = (models) => async (event: DroitsSurLeProjetRévoqués) => {
  const UserProjectModel = models.UserProjects
  const { projetId } = event.payload

  try {
    await UserProjectModel.destroy({ where: { projectId: projetId } })
  } catch (e) {
    logger.error(e)
  }
}
