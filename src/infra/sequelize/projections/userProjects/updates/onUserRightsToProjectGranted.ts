import { logger } from '../../../../../core/utils'
import { UserRightsToProjectGranted } from '../../../../../modules/authorization'

export const onUserRightsToProjectGranted =
  (models) => async (event: UserRightsToProjectGranted) => {
    const { UserProjects } = models
    const { userId, projectId } = event.payload
    try {
      await UserProjects.create({
        userId,
        projectId,
      })
    } catch (e) {
      logger.error(e)
    }
  }
