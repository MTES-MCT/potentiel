import {
  LegacyModificationFileAttachedDTO,
  LegacyModificationImportedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '@modules/frise'
import { extractLegacyModificationsItemProps } from './extractLegacyModificationsItemProps'

describe('extractLegacyModificationsItemProps', () => {
  describe('when there is no event at all', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = []
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there is no LegacyModificationImported event', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: 12,
        } as ProjectNotifiedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there is a legacy abandon modification accepted', () => {
    it('should return an array with legacy abandon accepted props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'abandon',
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'acceptée',
          modificationType: 'abandon',
        },
      ])
    })
  })

  describe('when there is a legacy abandon modification not accepted', () => {
    it('should return an array with legacy abandon not accepted props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'abandon',
          status: 'rejetée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'rejetée',
          modificationType: 'abandon',
        },
      ])
    })
  })

  describe('when there is a legacy recours modification', () => {
    it('should return an array with legacy recours props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'recours',
          status: 'rejetée',
          motifElimination: 'motif',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'rejetée',
          modificationType: 'recours',
          motifElimination: 'motif',
        },
      ])
    })
  })

  describe('when there is a legacy delai modification that is accepted', () => {
    it('should return an array with legacy delai props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'delai',
          ancienneDateLimiteAchevement: new Date('2022-01-01').getTime(),
          nouvelleDateLimiteAchevement: new Date('2024-01-01').getTime(),
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'acceptée',
          modificationType: 'delai',
          ancienneDateLimiteAchevement: new Date('2022-01-01').getTime(),
          nouvelleDateLimiteAchevement: new Date('2024-01-01').getTime(),
        },
      ])
    })
  })

  describe('when there is a legacy delai modification not accepted', () => {
    it('should not return props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'delai',
          ancienneDateLimiteAchevement: new Date('2022-01-01').getTime(),
          nouvelleDateLimiteAchevement: new Date('2024-01-01').getTime(),
          status: 'rejetée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'rejetée',
          modificationType: 'delai',
        },
      ])
    })
  })

  describe('when there is a legacy actionnaire modification', () => {
    it('should return an array with legacy actionnaire props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'actionnaire',
          actionnairePrecedent: 'actionnaire précédent',
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'acceptée',
          modificationType: 'actionnaire',
          actionnairePrecedent: 'actionnaire précédent',
        },
      ])
    })
  })

  describe('when there is a legacy producteur modification', () => {
    it('should return an array with legacy producteur props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'producteur',
          producteurPrecedent: 'producteur précédent',
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'acceptée',
          modificationType: 'producteur',
          producteurPrecedent: 'producteur précédent',
        },
      ])
    })
  })

  describe('when there is a legacy "autre" modification', () => {
    it('should return an array with legacy "autre" modification props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'acceptée',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
        },
      ])
    })
  })
  describe('when there is a legacy "autre" modification pending', () => {
    it('should return an array with legacy "autre" modification props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
          status: 'accord-de-principe',
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'accord-de-principe',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
        },
      ])
    })
  })

  describe('when there is a file attached with the same filename', () => {
    it('should attach the file to the correct modification', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
          status: 'accord-de-principe',
          filename: 'file.pdf',
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationImported',
          date,
          variant: 'admin',
          modificationType: 'autre',
          status: 'acceptée',
          column: 'col',
          value: 'val',
          filename: 'otherfile.pdf',
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationFileAttached',
          date,
          variant: 'admin',
          file: { id: 'fileId', name: 'file.pdf' },
        } as LegacyModificationFileAttachedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(2)
      expect(result).toEqual([
        {
          type: 'modification-historique',
          date,
          status: 'accord-de-principe',
          modificationType: 'autre',
          column: 'col',
          value: 'val',
          courrier: { id: 'fileId', name: 'file.pdf' },
        },
        {
          type: 'modification-historique',
          date,
          modificationType: 'autre',
          column: 'col',
          value: 'val',
          status: 'acceptée',
        },
      ])
    })
  })
})
