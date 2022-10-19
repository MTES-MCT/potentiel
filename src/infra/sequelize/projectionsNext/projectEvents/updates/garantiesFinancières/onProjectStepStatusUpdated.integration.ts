import { ProjectEvent } from '../../projectEvent.model'
import { UniqueEntityID } from '@core/domain'
import { ProjectStepStatusUpdated, ProjectStepStatusUpdatedPayload } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import onProjectStepStatusUpdated from './onProjectStepStatusUpdated'
import models from '../../../../models'

describe('Handler onProjectStepStatusUpdated', () => {
  const projectStepId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const { ProjectStep } = models
  const occurredAt = new Date('2022-01-14')

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Etant donné un élément GF avec le statut 'pending-validation' dans ProjectEvent,
      alors il devrait être mis à jour avec le statut 'validated'`, async () => {
    await ProjectStep.create({
      id: projectStepId,
      type: 'garantie-financiere',
      projectId,
      stepDate: new Date('2022-01-14'),
      fileId: new UniqueEntityID().toString(),
      submittedOn: new Date('2022-01-14'),
      submittedBy: new UniqueEntityID().toString(),
    })

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'GarantiesFinancières',
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'pending-validation' },
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

    const projectEvent = await ProjectEvent.findOne({
      where: { projectId, type: 'GarantiesFinancières' },
    })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'GarantiesFinancières',
      projectId,
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        statut: 'validated',
      },
    })
  })

  it(`Etant donné un élément GF avec le statut 'validated' dans ProjectEvent,
      alors il devrait être mis à jour avec le statut 'pending-validation'`, async () => {
    await ProjectStep.create({
      id: projectStepId,
      type: 'garantie-financiere',
      projectId,
      stepDate: new Date('2022-01-14'),
      fileId: new UniqueEntityID().toString(),
      submittedOn: new Date('2022-01-14'),
      submittedBy: new UniqueEntityID().toString(),
    })

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'validated' },
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

    const projectEvent = await ProjectEvent.findOne({
      where: { projectId, type: 'GarantiesFinancières' },
    })
    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'GarantiesFinancières',
      projectId,
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        statut: 'pending-validation',
      },
    })
  })
})
