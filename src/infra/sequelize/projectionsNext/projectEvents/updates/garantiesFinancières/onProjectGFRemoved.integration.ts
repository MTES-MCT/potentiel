import { ProjectEvent } from '../..'
import { UniqueEntityID } from '@core/domain'
import { ProjectGFRemoved, ProjectGFRemovedPayload } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import onProjectGFRemoved from './onProjectGFRemoved'

describe('Handler onProjectGFRemoved', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  it(`Etant donné un élément GF avec le statut 'pending-validation' dans ProjectEvent,
      alors il devrait être mis à jour avec le statut 'due'`, async () => {
    const projectId = new UniqueEntityID().toString()
    const removedBy = 'user-id'
    const occurredAt = new Date('2022-01-12')
    const dateLimiteDEnvoi = new Date('2022-04-12')

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: {
        statut: 'pending-validation',
        dateLimiteDEnvoi: dateLimiteDEnvoi.getTime(),
      },
    })

    await onProjectGFRemoved(
      new ProjectGFRemoved({
        payload: { projectId, removedBy } as ProjectGFRemovedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
    })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      projectId,
      type: 'GarantiesFinancières',
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        statut: 'due',
        dateLimiteDEnvoi: dateLimiteDEnvoi.getTime(),
      },
    })
  })
})
