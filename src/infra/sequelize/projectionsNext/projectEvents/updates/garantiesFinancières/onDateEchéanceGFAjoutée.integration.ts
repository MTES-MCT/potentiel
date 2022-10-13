import { UniqueEntityID } from '@core/domain'
import { DateEchéanceGFAjoutée } from '@modules/project'
import { resetDatabase } from '../../../../helpers'
import { ProjectEvent } from '../../projectEvent.model'
import onDateEchéanceGFAjoutée from './onDateEchéanceGFAjoutée'

describe('Handler onDateEchéanceGFAjoutée de ProjectEvent', () => {
  describe(`Ajout de la date d'échance au dernier événement GF de ProjectEvent`, () => {
    describe('Etant donné deux événements ProjectGFSubmitted et ProjectGFUploaded', () => {
      const projectId = new UniqueEntityID().toString()
      const expirationDate = new Date('2024-01-01')

      beforeAll(async () => {
        await resetDatabase()
        try {
          await ProjectEvent.create({
            id: new UniqueEntityID().toString(),
            type: 'GarantiesFinancières',
            projectId: projectId,
            valueDate: new Date('2020-01-01').getTime(),
            eventPublishedAt: new Date('2020-01-01').getTime(),
            payload: { statut: 'uploaded' },
          })
        } catch (e) {
          console.log(e)
        }
      })
      it(`Alors la date d'échance devrait être ajoutée au dernier événement`, async () => {
        const occurredAt = new Date()
        await onDateEchéanceGFAjoutée(
          new DateEchéanceGFAjoutée({
            payload: { projectId, expirationDate, submittedBy: 'id' },
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
          projectId,
          valueDate: new Date('2020-01-01').getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: { statut: 'uploaded', dateExpiration: expirationDate.getTime() },
        })
      })
    })
  })
})
