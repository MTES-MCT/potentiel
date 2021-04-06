import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectStepStatusUpdated } from '../../../../../modules/project/events'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectStepStatusUpdated } from './onProjectStepStatusUpdated'

describe('projectStep.onProjectStepStatusUpdated', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()
  const statusUpdatedBy = new UniqueEntityID().toString()
  const createdAt = new Date(1234)

  describe('when event is ProjectStepStatusUpdated', () => {
    beforeAll(async () => {
      await resetDatabase()
    })

    it(`should update the step status to 'validé' when it is set to 'à traiter`, async () => {
      const projectStepId = new UniqueEntityID().toString()

      await ProjectStep.create({
        id: projectStepId,
        projectId,
        type: 'gf',
        stepDate: new Date(123),
        fileId: new UniqueEntityID().toString(),
        submittedBy: new UniqueEntityID().toString(),
        submittedOn: createdAt,
        status: 'à traiter',
      })

      expect(await ProjectStep.findByPk(projectStepId)).not.toBeNull()

      const event = new ProjectStepStatusUpdated({
        payload: {
          projectStepId,
          statusUpdatedBy,
          newStatus: 'validé',
        },
      })

      await onProjectStepStatusUpdated(models)(event)

      const projectStep = await ProjectStep.findByPk(projectStepId)
      expect(projectStep.status).toStrictEqual('validé')
      expect(projectStep.statusUpdatedBy).toStrictEqual(statusUpdatedBy)
      expect(projectStep.statusUpdatedOn).not.toEqual(createdAt)
    })

    it(`should update the step status to 'à traiter' when it is set to 'validé`, async () => {
      const projectStepId = new UniqueEntityID().toString()

      await ProjectStep.create({
        id: projectStepId,
        projectId,
        type: 'gf',
        stepDate: new Date(123),
        fileId: new UniqueEntityID().toString(),
        submittedBy: new UniqueEntityID().toString(),
        submittedOn: createdAt,
        status: 'validé',
      })

      expect(await ProjectStep.findByPk(projectStepId)).not.toBeNull()

      const event = new ProjectStepStatusUpdated({
        payload: {
          projectStepId,
          statusUpdatedBy,
          newStatus: 'à traiter',
        },
      })

      await onProjectStepStatusUpdated(models)(event)

      const projectStep = await ProjectStep.findByPk(projectStepId)
      expect(projectStep.status).toStrictEqual('à traiter')
      expect(projectStep.statusUpdatedBy).toStrictEqual(statusUpdatedBy)
      expect(projectStep.statusUpdatedOn).not.toEqual(createdAt)
    })
  })
})
