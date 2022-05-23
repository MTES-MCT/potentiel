import { UniqueEntityID } from '@core/domain'
import { DateEchéanceGFAjoutée } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDateEchéanceGFAjoutée from './onDateEchéanceGFAjoutée'

describe('onDateEchéanceGFAjoutée', () => {
  describe('when there are several ProjectGFSubmitted/Uploaded event in ProjectEvent', () => {
    const projectId = new UniqueEntityID().toString()
    const expirationDate = new Date('2024-01-01')
    const eventId = new UniqueEntityID().toString()

    beforeEach(async () => {
      await resetDatabase()
      try {
        ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          type: 'ProjectGFSubmitted',
          projectId: projectId,
          valueDate: new Date('2020-01-01').getTime(),
          eventPublishedAt: 123,
          payload: {},
        })
        ProjectEvent.create({
          id: eventId,
          type: 'ProjectGFUploaded',
          projectId: projectId,
          valueDate: new Date('2020-01-01').getTime(),
          eventPublishedAt: 456,
          payload: { file: { id: 'id', name: 'name' } },
        })
      } catch (e) {
        console.log(e)
      }
    })
    it('should add an expiration date to the latest event published', async () => {
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
        valueDate: new Date('2020-01-01').getTime(),
        eventPublishedAt: 456,
        payload: { file: { id: 'id', name: 'name' }, expirationDate: expirationDate.getTime() },
      })
    })
  })
})
