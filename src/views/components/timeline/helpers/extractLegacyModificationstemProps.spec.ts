import { LegacyModificationImportedDTO, ProjectEventDTO, ProjectNotifiedDTO } from '@modules/frise'
import { extractLegacyModificationsItemProps } from './extractLegacyModificationsItemProps'

describe('extractLegacyModificationsItemProps', () => {
  describe('when there is no event at all', () => {
    it('should return an empry array', () => {
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
          accepted: true,
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
          accepted: false,
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
          accepted: false,
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
          accepted: true,
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
          accepted: false,
        } as LegacyModificationImportedDTO,
      ]
      const result = extractLegacyModificationsItemProps(projectEventList)
      expect(result).toHaveLength(0)
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
})
