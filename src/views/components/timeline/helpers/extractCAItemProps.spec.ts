import { ProjectImportedDTO, ProjectNotifiedDTO } from 'src/modules/frise/dtos/ProjectEventListDTO'
import { extractCAItemProps } from './extractCAItemProps'

describe('extractCAItemProps', () => {
  describe(`when the project is not lauréat`, () => {
    const project = {
      isLaureat: false,
    }
    it(`should return null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractCAItemProps(events, project)
      expect(result).toEqual(null)
    })
  })
  describe('when project is lauréat', () => {
    const project = {
      isLaureat: true,
    }
    describe('when there is no events', () => {
      it('should return null', () => {
        const events = []
        const result = extractCAItemProps(events, project)
        expect(result).toBeNull()
      })
    })
    describe('when there is no CA event yet', () => {
      it('is should still return props for a CA item with no due date', () => {
        const events = [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
          } as ProjectImportedDTO,
        ]

        const result = extractCAItemProps(events, project)

        expect(result).toEqual({
          type: 'contrat-achat',
          status: 'not-submitted',
        })
      })
    })
  })
})
