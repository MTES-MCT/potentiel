import { mapTimelineItemList } from './mapTimelineItemList'

describe('mapTimelineItemList', () => {
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
      ],
    }
    const result = mapTimelineItemList(projectEventList)
    expect(result).toHaveLength(1)
    expect(result[0].events).toEqual(projectEventList.events)
    expect(result[0].date).toEqual(12)
  })
})
