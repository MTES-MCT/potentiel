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
    it('should create a groupe with the latest event of type ProjectGFDueDateSet or ProjectGFSubmitted', () => {
      const projectEventList: ProjectEventListDTO = {
        events: [
          {
            type: 'ProjectGFSubmitted',
            variant: 'admin',
            fileId: 'certif-if',
            filename: 'file-name',
            submittedBy: 'user-id',
            date: 15,
            gfDate: 12,
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            garantiesFinancieresDueOn: 16,
            date: 14,
          } as ProjectGFDueDateSetDTO,
        ],
      }
      const result = mapTimelineItemList(projectEventList)
      expect(result).toHaveLength(1)
      expect(result[0].events).toHaveLength(1)
      expect(result[0].type).toEqual('garantiesFinancieres')
      expect(result[0].events).toEqual([
        {
          type: 'ProjectGFSubmitted',
          variant: 'admin',
          fileId: 'certif-if',
          filename: 'file-name',
          submittedBy: 'user-id',
          date: 15,
          gfDate: 12,
        },
      ])
    })
    describe('when the event to be returned is ProjectGFDueDateSet', () => {
      it('should return a group whose date is the event garantiesFinancieresDueOn', async () => {
        const projectEventList: ProjectEventListDTO = {
          events: [
            {
              type: 'ProjectGFDueDateSet',
              variant: 'porteur-projet',
              garantiesFinancieresDueOn: 16,
              date: 14,
            } as ProjectGFDueDateSetDTO,
          ],
        }
        const result = mapTimelineItemList(projectEventList)
        expect(result[0].date).toEqual(16)
      })
    })
    describe('when the event to be returned is ProjectGFSubmitted', () => {
      it('should return a group whose date is the event gfDate', async () => {
        const projectEventList: ProjectEventListDTO = {
          events: [
            {
              type: 'ProjectGFSubmitted',
              variant: 'admin',
              fileId: 'certif-if',
              filename: 'file-name',
              submittedBy: 'user-id',
              date: 15,
              gfDate: 12,
            } as ProjectGFSubmittedDTO,
          ],
        }
        const result = mapTimelineItemList(projectEventList)
        expect(result[0].date).toEqual(12)
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
      expect(result[0].events).toEqual(projectEventList.events)
      expect(result[0].type).toEqual('designation')
      expect(result[0].date).toEqual(12)
    })
  })

  describe('Import', () => {
    it('should create a group with the ProjectImported event', () => {
      const projectEventList = {
        events: [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
          } as ProjectImportedDTO,
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
            type: 'ProjectNotified',
            variant: 'admin',
            date: 12,
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
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
