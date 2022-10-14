import { UniqueEntityID } from '@core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '@modules/project'
import models from '../../../../models'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFSubmitted from './onProjectGFSubmitted'

describe('Handler onProjectGFSubmitted', () => {
  const { File } = models
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const gfDate = new Date('2021-12-26')
  const filename = 'my-file'
  const expirationDate = new Date('2025-01-01')
  const id = new UniqueEntityID().toString()

  it(`Etant donné un élément GF avec le statut 'due' dans ProjectEvent,
  alors il devrait être mis à jour avec le fichier soumis`, async () => {
    await File.create({
      id: fileId,
      filename,
      designation: 'designation',
    })

    await ProjectEvent.create({
      id,
      type: 'GarantiesFinancières',
      projectId,
      valueDate: new Date('2020-01-01').getTime(),
      eventPublishedAt: new Date('2020-01-01').getTime(),
      payload: { statut: 'due' },
    })

    await onProjectGFSubmitted(
      new ProjectGFSubmitted({
        payload: {
          projectId,
          fileId,
          submittedBy,
          gfDate,
          expirationDate,
        } as ProjectGFSubmittedPayload,
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
        fichier: { id: fileId, name: filename },
        dateConstitution: gfDate.getTime(),
      },
    })
  })
})
