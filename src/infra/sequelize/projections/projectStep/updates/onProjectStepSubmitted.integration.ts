import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted, ProjectGFSubmitted, ProjectPTFSubmitted } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'

describe('projectStep.onProjectStepSubmitted', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()

  beforeEach(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  describe('when event is ProjectPTFSubmitted', () => {
    it('should create a new ptf step', async () => {
      const event = new ProjectPTFSubmitted({
        payload: {
          projectId,
          ptfDate: new Date(123),
          fileId,
          submittedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(345),
        },
      })
      await onProjectStepSubmitted(models)(event)

      const projection = await ProjectStep.findOne({ where: { projectId } })

      expect(projection).toBeTruthy()
      if (!projection) return

      expect(projection.get()).toMatchObject({
        type: 'ptf',
        projectId,
        stepDate: new Date(123),
        fileId,
        submittedBy: userId,
        submittedOn: new Date(345),
        details: null,
      })
    })
  })

  describe('when event is ProjectDCRSubmitted', () => {
    it('should create a new dcr step', async () => {
      const event = new ProjectDCRSubmitted({
        payload: {
          projectId,
          dcrDate: new Date(123),
          fileId,
          numeroDossier: 'numeroDossier',
          submittedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(456),
        },
      })
      await onProjectStepSubmitted(models)(event)

      const projection = await ProjectStep.findOne({ where: { projectId } })

      expect(projection).toBeTruthy()
      if (!projection) return

      expect(projection.get()).toMatchObject({
        type: 'dcr',
        projectId,
        stepDate: new Date(123),
        fileId,
        submittedBy: userId,
        submittedOn: new Date(456),
        details: {
          numeroDossier: 'numeroDossier',
        },
      })
    })
  })

  describe('when event is ProjectGFSubmitted', () => {
    it('should create a new garantie-financiere step', async () => {
      const event = new ProjectGFSubmitted({
        payload: {
          projectId,
          gfDate: new Date(123),
          fileId,
          submittedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(456),
        },
      })
      await onProjectStepSubmitted(models)(event)

      const projection = await ProjectStep.findOne({ where: { projectId } })

      expect(projection).toBeTruthy()
      if (!projection) return

      expect(projection.get()).toMatchObject({
        type: 'garantie-financiere',
        projectId,
        stepDate: new Date(123),
        fileId,
        submittedBy: userId,
        submittedOn: new Date(456),
        details: null,
      })
    })
  })
})
