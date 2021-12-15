import { getLatestCertificateEvent } from './getLatestCertificateEvent'

describe('getLatestCertificateEvent', () => {
  const events1 = [
    {
      type: 'ProjectNotified' as 'ProjectNotified',
      variant: 'admin' as 'admin',
      date: 14,
    },
    {
      type: 'ProjectCertificateUpdated' as 'ProjectCertificateUpdated',
      variant: 'admin' as 'admin',
      date: 10,
    },
    {
      type: 'ProjectCertificateGenerated' as 'ProjectCertificateGenerated',
      variant: 'admin' as 'admin',
      date: 13,
    },
    {
      type: 'ProjectCertificateRegenerated' as 'ProjectCertificateRegenerated',
      variant: 'admin' as 'admin',
      date: 12,
    },
  ]

  const events2 = [
    {
      type: 'ProjectNotified' as 'ProjectNotified',
      variant: 'admin' as 'admin',
      date: 14,
    },
  ]

  describe('when "events" contains events of types ProjectCertificateGenerated, ProjectCertificateRegenerated or ProjectCertificateUpdated', () => {
    it('should return the latest event from events of type ProjectCertificateGenerated, ProjectCertificateRegenerated and ProjectCertificateUpdated', () => {
      const result1 = getLatestCertificateEvent(events1)
      expect(result1?.date).toEqual(13)
    })
  })

  describe('when "events" does not contain events of type ProjectCertificateGenerated, ProjectCertificateRegenerated or ProjectCertificateUpdated', () => {
    it('should return null', () => {
      const result2 = getLatestCertificateEvent(events2)
      expect(result2).toEqual(undefined)
    })
  })
})
