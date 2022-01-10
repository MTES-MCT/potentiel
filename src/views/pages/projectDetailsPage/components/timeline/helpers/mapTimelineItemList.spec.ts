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
})
