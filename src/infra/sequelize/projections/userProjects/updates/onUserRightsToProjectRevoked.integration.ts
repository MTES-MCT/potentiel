import { UniqueEntityID } from '../../../../../core/domain'
import { UserRightsToProjectRevoked } from '../../../../../modules/authZ'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onUserRightsToProjectRevoked } from './onUserRightsToProjectRevoked'

describe('userProjects.onUserRightsToProjectRevoked', () => {
  const UserProjectsModel = models.UserProjects

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await UserProjectsModel.bulkCreate([
      {
        userId,
        projectId,
      },
      {
        userId: new UniqueEntityID().toString(),
        projectId,
      },
      {
        userId,
        projectId: new UniqueEntityID().toString(),
      },
      {
        userId: new UniqueEntityID().toString(),
        projectId: new UniqueEntityID().toString(),
      },
    ])
  })

  it('should remove all instances for this userId and projectId', async () => {
    expect(await UserProjectsModel.count({ where: { userId, projectId } })).toEqual(1)
    expect(await UserProjectsModel.count()).toEqual(4)

    const event = new UserRightsToProjectRevoked({
      payload: {
        projectId,
        userId,
        revokedBy: new UniqueEntityID().toString(),
      },
    })
    await onUserRightsToProjectRevoked(models)(event)

    expect(await UserProjectsModel.count({ where: { userId, projectId } })).toEqual(0)
    expect(await UserProjectsModel.count()).toEqual(3)
  })
})
