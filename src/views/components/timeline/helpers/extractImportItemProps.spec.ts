import { ProjectNotifiedDTO, ProjectImportedDTO } from '@modules/frise'
import { extractImportItemProps } from './extractImportItemProps'

describe('extractImportItemProps', () => {
  describe(`when there is a ProjectNotified event`, () => {
    it('should return null', () => {
      const events = [
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
      ]

      const result = extractImportItemProps(events)

      expect(result).toBeNull()
    })
  })

  describe(`when there is a ProjectNotified event`, () => {
    it('should return the import date', () => {
      const events = [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: 12,
        } as ProjectImportedDTO,
      ]

      const result = extractImportItemProps(events)

      expect(result).toEqual({
        type: 'import',
        date: 12,
      })
    })
  })
})
