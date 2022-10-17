import { UniqueEntityID } from '@core/domain'
import { ProjectGFInvalidated } from '@modules/project'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFInvalidated from './onProjectGFInvalidated'

describe('Handler onProjectGFInvalidated', () => {
  const projectId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const gfDate = new Date('2021-12-26')
  const id = new UniqueEntityID().toString()

  it(`Etant donné un élément GF avec le statut 'validated' dans ProjectEvent,
      alors il devrait être mis à jour avec le statut 'pending-validation'`, async () => {
    await ProjectEvent.create({
      id,
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'validated', dateConstitution: gfDate.getTime() },
    })

    await onProjectGFInvalidated(
      new ProjectGFInvalidated({
        payload: { projectId },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
    })

    expect(projectEvent).toMatchObject({
      id,
      type: 'GarantiesFinancières',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        statut: 'pending-validation',
        dateConstitution: gfDate.getTime(),
      },
    })
  })
})
