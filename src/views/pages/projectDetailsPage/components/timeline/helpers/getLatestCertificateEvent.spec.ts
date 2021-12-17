import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'
import { getLatestCertificateEvent } from './getLatestCertificateEvent'

describe('getLatestCertificateEvent', () => {
  const events1: ProjectEventDTO[] = [
    {
      type: 'ProjectNotified' as 'ProjectNotified',
      variant: 'admin' as 'admin',
      date: 14,
    },
    {
      type: 'ProjectCertificateUpdated',
      variant: 'admin',
      date: 10,
    } as ProjectCertificateUpdatedDTO,
    {
      type: 'ProjectCertificateGenerated',
      variant: 'admin',
      date: 13,
    } as ProjectCertificateGeneratedDTO,
    {
      type: 'ProjectCertificateRegenerated',
      variant: 'admin',
      date: 12,
    } as ProjectCertificateRegeneratedDTO,
  ]

  const events2 = [
    {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 14,
    } as ProjectNotifiedDTO,
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
