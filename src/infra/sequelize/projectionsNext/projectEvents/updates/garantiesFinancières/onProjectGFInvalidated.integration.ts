import { ProjectEvent } from '../..'
import { UniqueEntityID } from '@core/domain'
import { ProjectGFInvalidated, ProjectGFInvalidatedPayload } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import onProjectGFInvalidated from './onProjectGFInvalidated'

describe('Handler onProjectGFInvalidated', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  it(`Etant donné un élément GF avec le statut 'uploaded' et une date limite d'envoi dans ProjectEvent,
      alors il devrait être mis à jour avec le statut 'due'.`, async () => {
    const projectId = new UniqueEntityID().toString()
    const occurredAt = new Date('2022-01-12')
    const dateLimiteDEnvoi = new Date('2023-01-01')

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'uploaded', dateLimiteDEnvoi: dateLimiteDEnvoi.getTime() },
    })

    await onProjectGFInvalidated(
      new ProjectGFInvalidated({
        payload: { projectId } as ProjectGFInvalidatedPayload,
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
      type: 'GarantiesFinancières',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { statut: 'due', dateLimiteDEnvoi: dateLimiteDEnvoi.getTime() },
    })
  })

  it(`Etant donné un élément GF avec le statut 'uploaded' et aucunue date limite d'envoi dans ProjectEvent,
      alors il devrait être supprimé.`, async () => {
    const projectId = new UniqueEntityID().toString()
    const occurredAt = new Date('2022-01-12')

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'uploaded' },
    })

    await onProjectGFInvalidated(
      new ProjectGFInvalidated({
        payload: { projectId } as ProjectGFInvalidatedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
    })

    expect(projectEvent).toBeNull()
  })
})
