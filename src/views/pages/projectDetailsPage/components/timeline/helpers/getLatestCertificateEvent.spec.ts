import {
  ProjectCertificateDTO,
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'
import { getLatestCertificateEvent } from './getLatestCertificateEvent'

describe('getLatestCertificateEvent', () => {
  describe('when "events" contains events of many different types', () => {
    const events: ProjectEventDTO[] = [
      {
        type: 'ProjectNotified',
        variant: 'admin',
        date: 16,
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

    it('should return the latest event of type ProjectCertificateRegenerated', () => {
      const result1 = getLatestCertificateEvent(events)
      expect(result1).not.toBeNull
      expect(result1?.date).toEqual(15)
      expect(result1?.type).toEqual('ProjectCertificateRegenerated')
    })

    describe('when "events" contains 2 events with same date', () => {
      const fixtures: ProjectCertificateDTO[] = [
        {
          type: 'ProjectCertificateUpdated',
          variant: 'admin',
        } as ProjectCertificateUpdatedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectCertificateRegenerated',
          variant: 'admin',
        } as ProjectCertificateRegeneratedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
        } as ProjectClaimedDTO,
      ]

      for (const certificateEvent of fixtures) {
        const { type } = certificateEvent
        it(`should return the latest event of type ${type}`, () => {
          const date = 14

          const result = getLatestCertificateEvent([
            {
              type: 'ProjectNotified',
              variant: 'admin',
              date,
            } as ProjectNotifiedDTO,
            { ...certificateEvent, date },
          ])

          expect(result).not.toBeNull
          expect(result?.date).toEqual(14)
          expect(result?.type).toEqual(type)
        })
      }
    })
  })

  describe('when "events" does not contain events of type ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated or ProjectClaimed', () => {
    const events = [
      {
        type: 'ProjectNotified',
        variant: 'admin',
        date: 14,
      } as ProjectNotifiedDTO,
    ]

    it('should return null', () => {
      const result = getLatestCertificateEvent(events)
      expect(result).toEqual(undefined)
    })
  })
})
