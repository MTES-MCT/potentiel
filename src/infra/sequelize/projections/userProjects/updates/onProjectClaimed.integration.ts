import { UniqueEntityID } from '@core/domain'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectClaimed } from './onProjectClaimed'

describe('userProjects.onProjectClaimed', () => {
  const { UserProjects } = models

  const projectId = new UniqueEntityID().toString()
  const claimedBy = new UniqueEntityID().toString()

  describe('on ProjectClaimed', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await onProjectClaimed(models)(
        new ProjectClaimed({
          payload: {
            projectId,
            claimedBy,
            claimerEmail: 'test@test.test',
            attestationDesignationFileId: new UniqueEntityID().toString(),
          },
        })
      )
    })

    it('should create a record for the specified userId and projectId', async () => {
      expect(await UserProjects.count({ where: { userId: claimedBy, projectId } })).toEqual(1)
    })
  })

  describe('on ProjectClaimedByOwner', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await onProjectClaimed(models)(
        new ProjectClaimedByOwner({
          payload: {
            projectId,
            claimedBy,
            claimerEmail: 'test@test.test',
          },
        })
      )
    })

    it('should create a record for the specified userId and projectId', async () => {
      expect(await UserProjects.count({ where: { userId: claimedBy, projectId } })).toEqual(1)
    })
  })
})
