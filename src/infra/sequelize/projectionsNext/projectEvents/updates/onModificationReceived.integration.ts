import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationReceived, ModificationReceivedPayload } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onModificationReceived from './onModificationReceived'

describe('onModificationReceived', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const user = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is an actionnaire modification event', () => {
    it('should create a new project event of type "actionnaire" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'actionnaire',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            actionnaire: 'nouvel actionnaire',
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: { modificationType: 'actionnaire', actionnaire: 'nouvel actionnaire' },
      })
    })
  })

  describe('when there is a producteur modification event', () => {
    it('should create a new project event of type "producteur" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'producteur',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            producteur: 'nouveau producteur',
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: { modificationType: 'producteur', producteur: 'nouveau producteur' },
      })
    })
  })

  describe('when there is a fournisseurs modification event', () => {
    it('should create a new project event of type "fournisseurs" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'fournisseurs',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            fournisseurs: [
              { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
              { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
            ],
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: {
          modificationType: 'fournisseurs',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
        },
      })
    })
  })
})
