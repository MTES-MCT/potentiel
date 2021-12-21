import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectEventListDTO,
} from '../../../../../../modules/frise'
import { mapTimelineItemList } from './mapTimelineItemList'
import {
  ProjectNotifiedDTO,
  ProjectCertificateUpdatedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

describe('mapTimelineItemList', () => {
  describe('Désignation', () => {
    describe(`when there isn't and event ProjectNotified`, () => {
      it('should not return group for ProjectCertificateGenerated, ProjectCertificateRegenerated, ProjectCertificateUpdated events', () => {
        const projectEventList: ProjectEventListDTO = {
          events: [
            {
              type: 'ProjectCertificateGenerated',
              variant: 'admin',
              potentielIdentifier: 'pot-id',
              certificateFileId: 'certif-if',
              nomProjet: 'nom-projet',
              email: 'email',
              date: 13,
            } as ProjectCertificateGeneratedDTO,
            {
              type: 'ProjectCertificateRegenerated',
              variant: 'admin',
              potentielIdentifier: 'pot-id',
              certificateFileId: 'certif-if',
              nomProjet: 'nom-projet',
              email: 'email',
              date: 13,
            } as ProjectCertificateRegeneratedDTO,
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
            type: 'ProjectNotified',
            variant: 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
            date: 12,
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectCertificateGenerated',
            variant: 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
            date: 13,
          } as ProjectCertificateGeneratedDTO,
          {
            type: 'ProjectCertificateRegenerated',
            variant: 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
            date: 13,
          } as ProjectCertificateRegeneratedDTO,
          {
            type: 'ProjectCertificateUpdated',
            variant: 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
            date: 13,
          } as ProjectCertificateUpdatedDTO,
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
            type: 'ProjectImported' as 'ProjectImported',
            variant: 'admin' as 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
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
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
            date: 12,
          },
          {
            type: 'ProjectImported' as 'ProjectImported',
            variant: 'admin' as 'admin',
            potentielIdentifier: 'pot-id',
            certificateFileId: 'certif-if',
            nomProjet: 'nom-projet',
            email: 'email',
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
