import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onProjectGFInvalidated } from './onProjectGFInvalidated'
import { ProjectGFInvalidated } from '../../../../../modules/project/events'
import { v4 as uuid } from 'uuid'
import makeFakeProjectStep from '../../../../../__tests__/fixtures/projectStep'

describe('project.onProjectGFInvalidated', () => {
  const { ProjectStep } = models
  const projectId = uuid()
  const projectStepId1 = uuid()
  const projectStepId2 = uuid()
  const projectStep2 = makeFakeProjectStep({
    id: projectStepId2,
    projectId,
    status: 'invalidé',
    updatedAt: new Date('01/01/2021'),
  })

  describe('when current GF status is "null"', () => {
    const projectStep1 = makeFakeProjectStep({ id: projectStepId1, projectId, status: null })

    beforeAll(async () => {
      await resetDatabase()
      await ProjectStep.bulkCreate([projectStep1, projectStep2])
      await onProjectGFInvalidated(models)(
        new ProjectGFInvalidated({
          payload: { projectId },
        })
      )
    })

    it('should set the GF status to "invalidé"', async () => {
      const updatedProjectSteps1 = await ProjectStep.findByPk(projectStepId1)
      expect(updatedProjectSteps1.status).toEqual('invalidé')
    })

    it('should not modify the GF that already has its status set to `invalidé`', async () => {
      const updatedProjectSteps2 = await ProjectStep.findByPk(projectStepId2)
      expect(updatedProjectSteps2.updatedAt).toEqual(projectStep2.updatedAt)
    })
  })

  describe('when current GF status is "à traiter"', () => {
    const projectStep1 = makeFakeProjectStep({ id: projectStepId1, projectId, status: 'à traiter' })

    beforeAll(async () => {
      await resetDatabase()
      await ProjectStep.bulkCreate([projectStep1, projectStep2])
      await onProjectGFInvalidated(models)(
        new ProjectGFInvalidated({
          payload: { projectId },
        })
      )
    })

    it('should set the GF status to "invalidé"', async () => {
      const updatedProjectSteps1 = await ProjectStep.findByPk(projectStepId1)
      expect(updatedProjectSteps1.status).toEqual('invalidé')
    })

    it('should not modify the GF that already has its status set to `invalidé`', async () => {
      const updatedProjectSteps2 = await ProjectStep.findByPk(projectStepId2)
      expect(updatedProjectSteps2.updatedAt).toEqual(projectStep2.updatedAt)
    })
  })

  describe('when current GF status is "validé"', () => {
    const projectStep1 = makeFakeProjectStep({ id: projectStepId1, projectId, status: 'validé' })

    beforeAll(async () => {
      await resetDatabase()
      await ProjectStep.bulkCreate([projectStep1, projectStep2])
      await onProjectGFInvalidated(models)(
        new ProjectGFInvalidated({
          payload: { projectId },
        })
      )
    })

    it('should set the GF status to "invalidé"', async () => {
      const updatedProjectSteps1 = await ProjectStep.findByPk(projectStepId1)
      expect(updatedProjectSteps1.status).toEqual('invalidé')
    })

    it('should not modify the GF that already has its status set to `invalidé`', async () => {
      const updatedProjectSteps2 = await ProjectStep.findByPk(projectStepId2)
      expect(updatedProjectSteps2.updatedAt).toEqual(projectStep2.updatedAt)
    })
  })
})
