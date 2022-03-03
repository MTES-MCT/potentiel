import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import { LegacyModificationImported } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onLegacyModificationImported from './onLegacyModificationImported'

describe('onLegacyModificationImported', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  describe('when there already are legacy modification in ProjectEvents for the same project', () => {
    it('should remove these events from ProjectEvents', async () => {
      const projectId = new UniqueEntityID().toString()
      const importId = new UniqueEntityID().toString()
      const id1 = new UniqueEntityID().toString()
      const id2 = new UniqueEntityID().toString()

      await ProjectEvent.create({
        id: id1,
        projectId,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })

      await ProjectEvent.create({
        id: id2,
        projectId,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })

      const projectEvents = await ProjectEvent.findAll({ where: { projectId } })
      expect(projectEvents).toHaveLength(2)

      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId: projectId.toString(),
            importId: importId.toString(),
            modifications: [],
          },
          original: {
            occurredAt: new Date('2022-01-01'),
            version: 1,
          },
        })
      )

      const projectEventsAfterNewEvent = await ProjectEvent.findAll({ where: { projectId } })
      expect(projectEventsAfterNewEvent).toHaveLength(0)

      const res1 = await ProjectEvent.findAll({ where: { id: id1 } })
      expect(res1).toHaveLength(0)

      const res2 = await ProjectEvent.findAll({ where: { id: id2 } })
      expect(res2).toHaveLength(0)
    })
  })

  describe('when a LegacyModificationImported event is emitted with modifications', () => {
    const projectId = new UniqueEntityID()
    const importId = new UniqueEntityID()
    const occurredAt = new Date('2022-01-01')

    it('should save a new event in ProjectEvent for each modification', async () => {
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId: projectId.toString(),
            importId: importId.toString(),
            modifications: [
              {
                modifiedOn: new Date('2019-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'abandon',
              },
              {
                modifiedOn: new Date('2019-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'recours',
                accepted: true,
                motifElimination: 'motif',
              },
              {
                modifiedOn: new Date('2020-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'delai',
                nouvelleDateLimiteAchevement: new Date('2021-07-01').getTime(),
                ancienneDateLimiteAchevement: new Date('2021-01-01').getTime(),
              },
              {
                modifiedOn: new Date('2021-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'actionnaire',
                actionnairePrecedent: 'nom ancien actionnaire',
                siretPrecedent: 'siret',
              },
              {
                modifiedOn: new Date('2022-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'producteur',
                producteurPrecedent: 'nom ancien producteur',
              },
            ],
          },
          original: {
            occurredAt,
            version: 1,
          },
        })
      )

      const projectEvent = await ProjectEvent.findAll({
        where: { projectId: projectId.toString() },
      })

      expect(projectEvent).toHaveLength(5)
      expect(projectEvent[0]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })
      expect(projectEvent[1]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'recours', accepted: true },
      })
      expect(projectEvent[2]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'delai', delayInMonths: 6 },
      })
      expect(projectEvent[3]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: {
          modificationType: 'actionnaire',
          actionnairePrecedent: 'nom ancien actionnaire',
        },
      })
      expect(projectEvent[4]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'producteur', producteurPrecedent: 'nom ancien producteur' },
      })
    })
  })
})
