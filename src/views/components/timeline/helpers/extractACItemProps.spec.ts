import { ProjectCompletionDueDateSetDTO, ProjectImportedDTO } from '@modules/frise'
import { extractACItemProps } from '.'

describe('extractACItemProps', () => {
  describe('when there are ProjectCompletionDueDateSet events', () => {
    it('should return the latest due date', () => {
      const events = [
        {
          type: 'ProjectCompletionDueDateSet',
          date: new Date('2024-01-01').getTime(),
          variant: 'admin',
        } as ProjectCompletionDueDateSetDTO,
        {
          type: 'ProjectCompletionDueDateSet',
          date: new Date('2025-01-01').getTime(),
          variant: 'admin',
        } as ProjectCompletionDueDateSetDTO,
      ]
      const result = extractACItemProps(events)
      expect(result).toMatchObject({
        type: 'attestation-de-conformite',
        date: new Date('2025-01-01').getTime(),
      })
    })
  })
  describe('when there are no ProjectCompletionDueDateSet events', () => {
    it('should return null', () => {
      const events = [
        {
          type: 'ProjectImported',
          date: new Date('2022-01-01').getTime(),
          variant: 'admin',
        } as ProjectImportedDTO,
      ]
      const result = extractACItemProps(events)
      expect(result).toBeNull()
    })
  })
})
