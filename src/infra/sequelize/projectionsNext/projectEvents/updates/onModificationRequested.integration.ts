import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequested, ModificationRequestedPayload } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onModificationRequested from './onModificationRequested'

describe('onModificationRequested', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })
  describe('when modification type is "delay"', () => {
    it('should create a new project event of modificationType delai', async () => {
      await onModificationRequested(
        new ModificationRequested({
          payload: {
            type: 'delai',
            modificationRequestId,
            projectId,
            requestedBy: 'user-id',
            authority: 'dgec',
            fileId: 'file-id',
            justification: 'en retard',
            delayInMonths: 10,
          } as ModificationRequestedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequested',
        projectId,
        payload: {
          modificationType: 'delai',
          modificationRequestId,
          delayInMonths: 10,
          authority: 'dgec',
        },
      })
    })
  })
})
