import { UniqueEntityID } from '@core/domain'
import { LegacyModificationImported } from '@modules/modificationRequest'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onLegacyModificationImported } from './onLegacyModificationImported'

describe('modificationRequest.onLegacyModificationImported', () => {
  const { ModificationRequest } = models

  const projectId = new UniqueEntityID().toString()
  const importId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  describe('generally', () => {
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
        },
        {
          id: legacyModificationId,
          projectId,
          userId,
          type: 'recours',
          status: 'acceptée',
          requestedOn: 1,
          isLegacy: true,
        },
      ])

      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [],
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

  describe('when given a legacy modification of type abandon that is accepted', () => {
    it('should add a modificationRequest of type abandon accepted', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'abandon',
                modifiedOn: 123,
                modificationId,
                status: 'acceptée',
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'abandon',
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type abandon that is not accepted', () => {
    it('should add a modificationRequest of type abandon not accepted', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'abandon',
                modifiedOn: 123,
                modificationId,
                status: 'rejetée',
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'abandon',
        status: 'rejetée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type actionnaire', () => {
    it('should add a modificationRequest of type actionnaire', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'actionnaire',
                actionnairePrecedent: 'actionnairePrecedent',
                siretPrecedent: 'siretPrecedent',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
                status: 'acceptée',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'actionnaire',
        acceptanceParams: {
          actionnairePrecedent: 'actionnairePrecedent',
          siretPrecedent: 'siretPrecedent',
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type delai that is accepted', () => {
    it('should add a modificationRequest of type delai accepted', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'delai',
                nouvelleDateLimiteAchevement: 1234,
                ancienneDateLimiteAchevement: 5678,
                modifiedOn: 123,
                modificationId,
                status: 'acceptée',
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'delai',
        acceptanceParams: {
          nouvelleDateLimiteAchevement: 1234,
          ancienneDateLimiteAchevement: 5678,
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type delai that is not accepted', () => {
    it('should add a modificationRequest of type delai not accepted', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'delai',
                modifiedOn: 123,
                modificationId,
                status: 'rejetée',
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'delai',
        status: 'rejetée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type producteur', () => {
    it('should add a modificationRequest of type producteur', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'producteur',
                producteurPrecedent: 'producteurPrecedent',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
                status: 'acceptée',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'producteur',
        acceptanceParams: {
          producteurPrecedent: 'producteurPrecedent',
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type recours and acceptée', () => {
    it('should add a modificationRequest of type recours and acceptée', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'recours',
                status: 'acceptée',
                motifElimination: 'motifElimination',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'recours',
        acceptanceParams: {
          motifElimination: 'motifElimination',
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })

  describe('when given a legacy modification of type recours and rejected', () => {
    it('should add a modificationRequest of type recours and rejected', async () => {
      const modificationId = new UniqueEntityID().toString()

      await resetDatabase()
      await onLegacyModificationImported(models)(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'recours',
                status: 'rejetée',
                motifElimination: 'motifElimination',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
              },
            ],
          },
        })
      )

      const newLegacyModification = await ModificationRequest.findByPk(modificationId)
      expect(newLegacyModification).not.toEqual(null)
      expect(newLegacyModification).toMatchObject({
        type: 'recours',
        acceptanceParams: {
          motifElimination: 'motifElimination',
        },
        status: 'rejetée',
        isLegacy: true,
        filename: 'filename',
      })
    })
  })
})
