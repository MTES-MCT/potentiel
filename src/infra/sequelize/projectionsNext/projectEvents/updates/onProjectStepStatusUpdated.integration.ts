import { ProjectEvent } from '../projectEvent.model'
import { UniqueEntityID } from '../../../../../core/domain'
import {
  ProjectStepStatusUpdated,
  ProjectStepStatusUpdatedPayload,
} from '../../../../../modules/project'
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

  it('should create a new ProjectStepStatusUpdated event on ProjectEvents projection', async () => {
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
      type: 'ProjectStepStatusUpdated',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { newStatus: 'validé', type: 'garantie-financiere' },
    })
  })
})
