import { UniqueEntityID } from '@core/domain'
import { DateEchéanceGFAjoutée } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDateEchéanceGFAjoutée from './onDateEchéanceGFAjoutée'

describe('Handler onDateEchéanceGFAjoutée de ProjectEvent', () => {
  describe(`Ajout de la date d'échance au dernier événement GF de ProjectEvent`, () => {
    describe('Etant donné deux événements ProjectGFSubmitted et ProjectGFUploaded', () => {
      const projectId = new UniqueEntityID().toString()
      const expirationDate = new Date('2024-01-01')
      const eventId = new UniqueEntityID().toString()

      beforeAll(async () => {
        await resetDatabase()
        try {
          ProjectEvent.create({
            id: new UniqueEntityID().toString(),
            type: 'ProjectGFSubmitted',
            projectId: projectId,
            valueDate: new Date('2020-01-01').getTime(),
            eventPublishedAt: new Date('2020-01-01').getTime(),
            payload: {},
          })
          ProjectEvent.create({
            id: eventId,
            type: 'ProjectGFUploaded',
            projectId: projectId,
            valueDate: new Date('2022-01-01').getTime(),
            eventPublishedAt: new Date('2022-01-01').getTime(),
            payload: { file: { id: 'id', name: 'name' } },
          })
        } catch (e) {
          console.log(e)
        }
      })
      it(`Alors la date d'échance devrait être ajoutée au dernier événement`, async () => {
        await onDateEchéanceGFAjoutée(
          new DateEchéanceGFAjoutée({
            payload: { projectId, expirationDate, submittedBy: 'id' },
          })
        )

        const res = await ProjectEvent.findOne({ where: { id: eventId } })

        expect(res).not.toBeNull()
        expect(res).toMatchObject({
          id: eventId,
          type: 'ProjectGFUploaded',
          projectId,
          valueDate: new Date('2022-01-01').getTime(),
          eventPublishedAt: new Date('2022-01-01').getTime(),
          payload: { file: { id: 'id', name: 'name' }, expirationDate: expirationDate.getTime() },
        })
      })
    })
  })
})
