import { UniqueEntityID } from '@core/domain'
import { ProjectClaimFailed } from '@modules/projectClaim'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectClaimFailed } from './onProjectClaimFailed'

describe('userProjects.onProjectClaimed', () => {
  const { UserProjectClaims } = models

  const projectId = new UniqueEntityID().toString()
  const claimedBy = new UniqueEntityID().toString()

  describe('when this is the first failed attempt', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await onProjectClaimFailed(models)(
        new ProjectClaimFailed({
          payload: {
            projectId,
            claimedBy,
          },
        })
      )
    })

    it('should set the failedAttempts column to 1', async () => {
      const result = await UserProjectClaims.findOne({ where: { projectId, userId: claimedBy } })
      expect(result.failedAttempts).toEqual(1)
    })
  })

  describe('when there has already been a failed attempt', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await UserProjectClaims.bulkCreate([
        {
          userId: claimedBy,
          projectId,
          failedAttempts: 1,
        },
      ])

      await onProjectClaimFailed(models)(
        new ProjectClaimFailed({
          payload: {
            projectId,
            claimedBy,
          },
        })
      )
    })

    it('should increment the failedAttempts column by 1', async () => {
      const result = await UserProjectClaims.findOne({ where: { projectId, userId: claimedBy } })
      expect(result.failedAttempts).toEqual(2)
    })
  })
})
