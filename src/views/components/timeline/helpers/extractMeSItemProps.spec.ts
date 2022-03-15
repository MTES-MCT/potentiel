import {
  ProjectEventListDTO,
  ProjectImportedDTO,
  ProjectNotifiedDTO,
} from 'src/modules/frise/dtos/ProjectEventListDTO'
import { extractMeSItemProps } from './extractMeSItemProps'

describe('extractMeSItemProps', () => {
  describe(`when the project is Eliminé`, () => {
    const project = {
      status: 'Eliminé',
    } as ProjectEventListDTO['project']

    it(`should return null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractMeSItemProps(events, project)
      expect(result).toEqual(null)
    })
  })

  describe(`when the project is Abandonné`, () => {
    const project = {
      status: 'Abandonné',
    } as ProjectEventListDTO['project']

    it(`should return null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractMeSItemProps(events, project)
      expect(result).toEqual(null)
    })
  })

  describe('when project is lauréat', () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project']

    describe('when there is no event at all', () => {
      it('should return null', () => {
        const events = []
        const result = extractMeSItemProps(events, project)
        expect(result).toBeNull()
      })
    })
    describe('when there is no MeS event yet', () => {
      it('is should still return props for a MeS item with no due date', () => {
        const events = [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
          } as ProjectImportedDTO,
        ]

        const result = extractMeSItemProps(events, project)

        expect(result).toEqual({
          type: 'mise-en-service',
          status: 'not-submitted',
        })
      })
    })
  })
})
