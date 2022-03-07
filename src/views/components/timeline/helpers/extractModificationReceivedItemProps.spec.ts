import { ModificationReceivedDTO, ProjectEventDTO, ProjectNotifiedDTO } from '@modules/frise'
import { extractModificationReceivedItemProps } from './extractModificationReceivedItemProps'

describe('extractModificationReceivedItemProps', () => {
  describe('when there is no event at all', () => {
    it('should return an empry array', () => {
      const projectEventList: ProjectEventDTO[] = []
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there is no ModificationReceived event', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: 12,
        } as ProjectNotifiedDTO,
      ]
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })

  describe('when there is an actionnaire modification', () => {
    it('should return an array with actionnaire props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationReceived',
          date,
          variant: 'admin',
          modificationType: 'actionnaire',
          actionnaire: 'actionnaire',
          modificationRequestId: 'id',
        } as ModificationReceivedDTO,
      ]
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-information',
          date,
          modificationType: 'actionnaire',
          actionnaire: 'actionnaire',
          detailsUrl: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a producteur modification', () => {
    it('should return an array with producteur props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationReceived',
          date,
          variant: 'admin',
          modificationType: 'producteur',
          producteur: 'producteur',
          modificationRequestId: 'id',
        } as ModificationReceivedDTO,
      ]
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-information',
          date,
          modificationType: 'producteur',
          producteur: 'producteur',
          detailsUrl: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a fournisseurs modification', () => {
    it('should return an array with fournisseurs props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationReceived',
          date,
          variant: 'admin',
          modificationType: 'fournisseur',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
          modificationRequestId: 'id',
        } as ModificationReceivedDTO,
      ]
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-information',
          date,
          modificationType: 'fournisseur',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
          detailsUrl: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a puissance modification', () => {
    it('should return an array with puissance props', () => {
      const date = new Date('2022-03-02').getTime()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationReceived',
          date,
          variant: 'admin',
          modificationType: 'puissance',
          puissance: 2,
          unitePuissance: 'MW',
          modificationRequestId: 'id',
        } as ModificationReceivedDTO,
      ]
      const result = extractModificationReceivedItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'modification-information',
          date,
          modificationType: 'puissance',
          puissance: 2,
          unitePuissance: 'MW',
          detailsUrl: expect.anything(),
        },
      ])
    })
  })
})
