import { UniqueEntityID } from '../../../../../core/domain'
import { UserRightsToProjectGranted } from '../../../../../modules/authorization'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onUserRightsToProjectGranted } from './onUserRightsToProjectGranted'

describe('userProjects.onUserRightsToProjectGranted', () => {
  const { UserProjects } = models

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  it('should create a line for this userId and projectId', async () => {
    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(0)

    await onUserRightsToProjectGranted(models)(
      new UserRightsToProjectGranted({
        payload: {
          projectId,
          userId,
          grantedBy: '',
        },
      })
    )

    expect(await UserProjects.count({ where: { userId, projectId } })).toEqual(1)
  })
})
