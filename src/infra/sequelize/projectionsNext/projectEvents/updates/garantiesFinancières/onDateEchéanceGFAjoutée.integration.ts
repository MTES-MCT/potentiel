import { UniqueEntityID } from '@core/domain'
import { DateEchéanceGFAjoutée } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import { ProjectEvent } from '../../projectEvent.model'
import onDateEchéanceGFAjoutée from './onDateEchéanceGFAjoutée'

describe('Handler onDateEchéanceGFAjoutée de ProjectEvent', () => {
  const projectId = new UniqueEntityID().toString()
  const expirationDate = new Date('2024-01-01')

  beforeEach(async () => {
    await resetDatabase()
  })
  it(`Étant donné aucun élément de type GF dans ProjectEvent
      Lorsque un énement de type 'DateEchéanceGFAjoutée' survient
      Alors l'évènement devrait être ignoré`, async () => {
    await onDateEchéanceGFAjoutée(
      new DateEchéanceGFAjoutée({
        payload: { projectId, expirationDate, submittedBy: 'id' },
        original: {
          version: 1,
          occurredAt: new Date(),
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
    })

    expect(projectEvent).toBeNull()
  })
  for (const statut of ['uploaded', 'validated', 'pending-validation']) {
    it(`Etant donné un élément GF avec le statut '${statut},
        Lorsque un énement de type 'DateEchéanceGFAjoutée' survient
        Alors cet élément doit être mis à jour avec la date d'expiration,
        et la de l'élément reste inchangée`, async () => {
      const dateEvenementInitial = new Date('2020-01-01')
      const dateEvenementCorrectif = new Date('2021-01-01')
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        projectId: projectId,
        valueDate: dateEvenementInitial.getTime(),
        eventPublishedAt: dateEvenementInitial.getTime(),
        payload: { statut },
      })

      await onDateEchéanceGFAjoutée(
        new DateEchéanceGFAjoutée({
          payload: { projectId, expirationDate, submittedBy: 'id' },
          original: {
            version: 1,
            occurredAt: dateEvenementCorrectif,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
      })

      expect(projectEvent).not.toBeNull()

      expect(projectEvent).toMatchObject({
        type: 'GarantiesFinancières',
        projectId,
        eventPublishedAt: dateEvenementInitial.getTime(),
        payload: { statut, dateExpiration: expirationDate.getTime() },
      })
    })
  }
})
