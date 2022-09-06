import { logger } from '@core/utils'
import { ToutAccèsAuProjetRevoqué } from '@modules/authZ'

export const onToutAccèsAuProjetRevoqué = (models) => async (event: ToutAccèsAuProjetRevoqué) => {
  const UserProjectModel = models.UserProjects
  const { projetId } = event.payload

  try {
    await UserProjectModel.destroy({ where: { projectId: projetId } })
  } catch (e) {
    logger.error(e)
  }
}
