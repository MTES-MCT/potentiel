import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import { LegacyModificationImported } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onLegacyModificationImported from './onLegacyModificationImported'
import models from '../../../models'

describe('onLegacyModificationImported', () => {
  describe('generally', () => {
    const { ModificationRequest } = models

    const projectId = new UniqueEntityID().toString()
    const importId = new UniqueEntityID().toString()
    const userId = new UniqueEntityID().toString()
    const nonLegacyModificationId = new UniqueEntityID().toString()
    const legacyModificationId = new UniqueEntityID().toString()

    beforeAll(async () => {
      await resetDatabase()

      await ModificationRequest.bulkCreate([
        {
          id: nonLegacyModificationId,
          projectId,
          userId,
          type: 'recours',
          status: 'envoyée',
          requestedOn: 1,
          requestedBy: userId,
        },
        {
          id: legacyModificationId,
          projectId,
          userId,
          type: 'recours',
          status: 'envoyée',
          requestedOn: 1,
          requestedBy: userId,
          isLegacy: true,
        },
      ])

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
    })

    it('should remove previous legacy modifications for this project', async () => {
      const previousLegacyModification = await ModificationRequest.findByPk(legacyModificationId)
      expect(previousLegacyModification).toEqual(null)
    })

    it('should not remove the non-legacy modifications', async () => {
      const projectModifications = await ModificationRequest.findAll({ where: { projectId } })
      expect(projectModifications).toHaveLength(1)
      expect(projectModifications.map((item) => item.id)).toContain(nonLegacyModificationId)
    })
  })

  describe('when a LegacyModificationImported event is emitted with modifications', () => {
    beforeAll(async () => {
      await resetDatabase()
    })
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
