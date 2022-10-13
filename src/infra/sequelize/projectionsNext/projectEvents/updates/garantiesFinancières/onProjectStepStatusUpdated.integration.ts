import { ProjectEvent } from '../projectEvent.model'
import { UniqueEntityID } from '@core/domain'
import { ProjectStepStatusUpdated, ProjectStepStatusUpdatedPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import onProjectStepStatusUpdated from './onProjectStepStatusUpdated'
import models from '../../../models'

describe('onProjectStepStatusUpdated', () => {
  const projectStepId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const { ProjectStep } = models
  const occurredAt = new Date('2022-01-14')

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when type is "garantie-financiere"', () => {
    describe('when status is "validé"', () => {
      it('should create a new ProjectGFValidated event on ProjectEvents projection', async () => {
        await ProjectStep.create({
          id: projectStepId,
          type: 'garantie-financiere',
          projectId,
          stepDate: new Date('2022-01-14'),
          fileId: new UniqueEntityID().toString(),
          submittedOn: new Date('2022-01-14'),
          submittedBy: new UniqueEntityID().toString(),
        })

        await onProjectStepStatusUpdated(
          new ProjectStepStatusUpdated({
            payload: {
              projectStepId,
              newStatus: 'validé',
              statusUpdatedBy: 'user-id',
            } as ProjectStepStatusUpdatedPayload,
            original: {
              version: 1,
              occurredAt,
            },
          })
        )

        const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
        expect(projectEvent).not.toBeNull()
        expect(projectEvent).toMatchObject({
          type: 'ProjectGFValidated',
          projectId,
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
        })
      })
    })
    describe('when status is "à traiter"', () => {
      it('should create a new ProjectGFInvalidated event on ProjectEvents projection', async () => {
        await ProjectStep.create({
          id: projectStepId,
          type: 'garantie-financiere',
          projectId,
          stepDate: new Date('2022-01-14'),
          fileId: new UniqueEntityID().toString(),
          submittedOn: new Date('2022-01-14'),
          submittedBy: new UniqueEntityID().toString(),
        })

        await onProjectStepStatusUpdated(
          new ProjectStepStatusUpdated({
            payload: {
              projectStepId,
              newStatus: 'à traiter',
              statusUpdatedBy: 'user-id',
            } as ProjectStepStatusUpdatedPayload,
            original: {
              version: 1,
              occurredAt,
            },
          })
        )

        const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
        expect(projectEvent).not.toBeNull()
        expect(projectEvent).toMatchObject({
          type: 'ProjectGFInvalidated',
          projectId,
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
        })
      })
    })
  })
})
