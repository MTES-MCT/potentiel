import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'
import { getLatestCertificateEvent } from './getLatestCertificateEvent'

describe('getLatestCertificateEvent', () => {
  const events1: ProjectEventDTO[] = [
    {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 14,
    } as ProjectNotifiedDTO,
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
      date: 15,
    } as ProjectCertificateRegeneratedDTO,
    {
      type: 'ProjectClaimed',
      variant: 'admin',
      date: 14,
    } as ProjectClaimedDTO,
  ]

  const events2 = [
    {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 14,
    } as ProjectNotifiedDTO,
  ]

  describe('when "events" contains events of types ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated or ProjectClaimed', () => {
    it('should return the latest event from events of type ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated or ProjectClaimed', () => {
      const result1 = getLatestCertificateEvent(events1)
      expect(result1).not.toBeNull
      expect(result1?.date).toEqual(15)
      expect(result1?.type).toEqual('ProjectCertificateRegenerated')
    })
  })

  describe('when "events" does not contain events of type ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated or ProjectClaimed', () => {
    it('should return null', () => {
      const result2 = getLatestCertificateEvent(events2)
      expect(result2).toEqual(undefined)
    })
  })
})
