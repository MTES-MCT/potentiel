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
  describe('when modification type is "delai"', () => {
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

  describe('when modification type is "abandon"', () => {
    it('should create a new project event of modificationType abandon', async () => {
      await onModificationRequested(
        new ModificationRequested({
          payload: {
            type: 'abandon',
            modificationRequestId,
            projectId,
            requestedBy: 'user-id',
            authority: 'dgec',
            fileId: 'file-id',
            justification: 'plus possible',
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
          modificationType: 'abandon',
          modificationRequestId,
          authority: 'dgec',
        },
      })
    })
  })

  describe('when modification type is "recours"', () => {
    it('should create a new project event of modificationType recours', async () => {
      await onModificationRequested(
        new ModificationRequested({
          payload: {
            type: 'recours',
            modificationRequestId,
            projectId,
            requestedBy: 'user-id',
            authority: 'dgec',
            fileId: 'file-id',
            justification: 'justification',
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
          modificationType: 'recours',
          modificationRequestId,
          authority: 'dgec',
        },
      })
    })
  })
})
