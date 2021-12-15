import { mapTimelineItemList } from './mapTimelineItemList'

describe('mapTimelineItemList', () => {
  describe('Désignation', () => {
    describe(`when there isn't and event ProjectNotified`, () => {
      it('should not return group for ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated events', () => {
        const projectEventList = {
          events: [
            {
              type: 'ProjectCertificateGenerated' as 'ProjectCertificateGenerated',
              variant: 'admin' as 'admin',
              date: 13,
            },
            {
              type: 'ProjectCertificateRegenerated' as 'ProjectCertificateRegenerated',
              variant: 'admin' as 'admin',
              date: 13,
            },
          ],
        }
        const result = mapTimelineItemList(projectEventList)
        expect(result).toHaveLength(0)
      })
    })

    it('should group ProjectNotified, ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated', () => {
      const projectEventList = {
        events: [
          {
            type: 'ProjectNotified' as 'ProjectNotified',
            variant: 'admin' as 'admin',
            date: 12,
          },
          {
            type: 'ProjectCertificateGenerated' as 'ProjectCertificateGenerated',
            variant: 'admin' as 'admin',
            date: 13,
          },
          {
            type: 'ProjectCertificateRegenerated' as 'ProjectCertificateRegenerated',
            variant: 'admin' as 'admin',
            date: 13,
          },
          {
            type: 'ProjectCertificateUpdated' as 'ProjectCertificateUpdated',
            variant: 'admin' as 'admin',
            date: 13,
          },
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)
      expect(result[0].events).toEqual(projectEventList.events)
      expect(result[0].type).toEqual('designation')
      expect(result[0].date).toEqual(12)

      // const imported = {
      //   type: 'ProjectImported' as 'ProjectImported',
      //   variant: 'admin' as 'admin',
      //   date: 11,
      // }

      // const result2 = mapTimelineItemList({
      //   ...projectEventList,
      //   events: [...projectEventList.events, imported],
      // })
      // expect(result2).toHaveLength(2)
    })
  })

  describe('Import', () => {
    it('should create a group with the ProjectImported event', () => {
      const projectEventList = {
        events: [
          {
            type: 'ProjectImported' as 'ProjectImported',
            variant: 'admin' as 'admin',
            date: 11,
          },
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)
      expect(result[0].events).toEqual(projectEventList.events)
      expect(result[0].type).toEqual('import')
      expect(result[0].date).toEqual(11)
    })

    describe('when there is a ProjectNotified event', () => {
      const projectEventList = {
        events: [
          {
            type: 'ProjectNotified' as 'ProjectNotified',
            variant: 'admin' as 'admin',
            date: 12,
          },
          {
            type: 'ProjectImported' as 'ProjectImported',
            variant: 'admin' as 'admin',
            date: 11,
          },
        ],
      }

      it('should ignore the ProjectImported event', () => {
        const result = mapTimelineItemList(projectEventList)
        expect(result).toHaveLength(1)
        expect(result[0].type).toEqual('designation')
      })
    })
  })
})
