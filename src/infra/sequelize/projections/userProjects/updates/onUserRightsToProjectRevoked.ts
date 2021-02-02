import { logger } from '../../../../../core/utils'
import { UserRightsToProjectRevoked } from '../../../../../modules/authorization'

export const onUserRightsToProjectRevoked = (models) => async (
  event: UserRightsToProjectRevoked
) => {
  const UserProjectsModel = models.UserProjects
  const { userId, projectId } = event.payload

  try {
    await UserProjectsModel.destroy({
      where: {
        userId,
        projectId,
      },
    })
  } catch (e) {
    logger.error(e)
  }
}
