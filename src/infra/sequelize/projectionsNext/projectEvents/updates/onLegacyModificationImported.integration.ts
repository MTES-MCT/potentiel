import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import { LegacyModificationImported } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onLegacyModificationImported from './onLegacyModificationImported'

describe('onLegacyModificationImported', () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  describe('when there already are events in ProjectEvents table', () => {
    it("should remove only the same project's legacy events", async () => {
      const projectId1 = new UniqueEntityID().toString()
      const id11 = new UniqueEntityID().toString()
      const id12 = new UniqueEntityID().toString()
      const id13 = new UniqueEntityID().toString()
      const importId1 = new UniqueEntityID().toString()
      const projectId2 = new UniqueEntityID().toString()
      const id2 = new UniqueEntityID().toString()

      await ProjectEvent.create({
        // legacy event, same project
        id: id11,
        projectId: projectId1,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })

      await ProjectEvent.create({
        // legacy event, same project
        id: id12,
        projectId: projectId1,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })

      await ProjectEvent.create({
        // non legacy event, same project
        id: id13,
        projectId: projectId1,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'ProjectImported',
        payload: { notifiedOn: 123 },
      })

      await ProjectEvent.create({
        // legacy event, different project
        id: id2,
        projectId: projectId2,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'LegacyModificationImported',
        payload: { modificationType: 'abandon' },
      })

      const projectEvents = await ProjectEvent.findAll()
      expect(projectEvents).toHaveLength(4)

      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId: projectId1.toString(),
            importId: importId1.toString(),
            modifications: [],
          },
          original: {
            occurredAt: new Date('2022-01-01'),
            version: 1,
          },
        })
      )

      const res = await ProjectEvent.findAll()
      expect(res).toHaveLength(2)

      const res1 = await ProjectEvent.findAll({ where: { id: id11 } })
      expect(res1).toHaveLength(0)

      const res2 = await ProjectEvent.findAll({ where: { id: id12 } })
      expect(res2).toHaveLength(0)

      const res3 = await ProjectEvent.findAll({ where: { id: id13 } })
      expect(res3).toHaveLength(1)

      const res4 = await ProjectEvent.findAll({ where: { id: id2 } })
      expect(res4).toHaveLength(1)
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
              {
                modifiedOn: new Date('2022-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'autre',
                column: 'col',
                value: 'val',
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

      expect(projectEvent).toHaveLength(6)
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
        payload: {
          modificationType: 'delai',
          nouvelleDateLimiteAchevement: new Date('2021-07-01').getTime(),
          ancienneDateLimiteAchevement: new Date('2021-01-01').getTime(),
        },
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
      expect(projectEvent[5]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'autre', column: 'col', value: 'val' },
      })
    })
  })
})
