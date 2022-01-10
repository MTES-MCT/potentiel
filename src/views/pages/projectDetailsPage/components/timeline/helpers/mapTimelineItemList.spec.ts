import { mapTimelineItemList } from './mapTimelineItemList'
import {
  ProjectNotifiedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectClaimedDTO,
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectEventListDTO,
  ProjectImportedDTO,
  ProjectGFSubmittedDTO,
  ProjectGFDueDateSetDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

describe('mapTimelineItemList', () => {
  describe('garantiesFinancières', () => {
    const gfDate = new Date('2021-10-15').getTime()
    const gfDueOn = new Date('2021-12-01').getTime()
    it('should return an object whose event value is the latest event of type ProjectGFDueDateSet or ProjectGFSubmitted', () => {
      // projectEventList returned by getProjectEvents contains a list of events already ordered by eventPublishedAt(=occurredAt)
      // in this case we assume ProjectGFSubmitted occures after ProjectGFDueDateSet
      const projectEventList: ProjectEventListDTO = {
        events: [
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: gfDueOn,
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'admin',
            fileId: 'certif-if',
            filename: 'file-name',
            submittedBy: 'user-id',
            date: gfDate,
          } as ProjectGFSubmittedDTO,
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)

      expect(result[0]).toMatchObject({
        event: {
          type: 'ProjectGFSubmitted',
          variant: 'admin',
          fileId: 'certif-if',
          filename: 'file-name',
          submittedBy: 'user-id',
          date: gfDate,
        },
        date: gfDate,
        type: 'garantiesFinancieres',
      })
    })
  })
  describe('Désignation', () => {
    describe(`when there is NOT a ProjectNotified event`, () => {
      it('should not return a group for ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated, ProjectClaimed events', () => {
        const projectEventList: ProjectEventListDTO = {
          events: [
            {
              type: 'ProjectCertificateGenerated',
              variant: 'admin',
              date: 13,
            } as ProjectCertificateGeneratedDTO,
            {
              type: 'ProjectCertificateRegenerated',
              variant: 'admin',
              date: 13,
            } as ProjectCertificateRegeneratedDTO,
            {
              type: 'ProjectCertificateUpdated',
              variant: 'admin',
              date: 13,
            } as ProjectCertificateUpdatedDTO,
            {
              type: 'ProjectClaimed',
              variant: 'admin',
              date: 13,
            } as ProjectClaimedDTO,
          ],
        }
        const result = mapTimelineItemList(projectEventList)
        expect(result).toHaveLength(0)
      })
    })

    it('should group ProjectNotified, ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated and ProjectClaimed events', () => {
      const projectEventList = {
        events: [
          {
            type: 'ProjectNotified',
            variant: 'admin',
            date: 12,
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectCertificateGenerated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateGeneratedDTO,
          {
            type: 'ProjectCertificateRegenerated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateRegeneratedDTO,
          {
            type: 'ProjectCertificateUpdated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateUpdatedDTO,
          {
            type: 'ProjectClaimed',
            variant: 'admin',
            date: 13,
          } as ProjectClaimedDTO,
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)

      expect(result[0].type).toEqual('designation')
      expect(result[0].date).toEqual(12)

      if (result[0].type === 'designation') {
        expect(result[0].events).toEqual(projectEventList.events)
      }
    })
  })

  describe('Import', () => {
    it('should create a group with the Import timeline item props', () => {
      const importedTimestamp = new Date('2022-01-06').getTime()
      const projectEventList = {
        events: [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: importedTimestamp,
          } as ProjectImportedDTO,
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)
      expect(result[0].type).toEqual('import')
      expect(result[0].date).toEqual(importedTimestamp)
    })

    describe('when there is a ProjectNotified event', () => {
      const importedTimestamp = new Date('2022-01-06').getTime()
      const notifiedTimestamp = new Date('2022-01-07').getTime()

      const projectEventList = {
        events: [
          {
            type: 'ProjectNotified',
            variant: 'admin',
            date: notifiedTimestamp,
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: importedTimestamp,
          } as ProjectImportedDTO,
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
