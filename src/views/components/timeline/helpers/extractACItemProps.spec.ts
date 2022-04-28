import {
  CovidDelayGrantedDTO,
  ProjectCompletionDueDateSetDTO,
  ProjectEventListDTO,
  ProjectImportedDTO,
} from '@modules/frise'
import { extractACItemProps } from '.'

describe('extractACItemProps', () => {
  describe('when there is no ProjectCompletionDueDateSet event', () => {
    it('should return null', () => {
      const project = {
        status: 'Classé',
      } as ProjectEventListDTO['project']
      const events = [
        {
          type: 'ProjectImported',
          date: new Date('2022-01-01').getTime(),
          variant: 'admin',
        } as ProjectImportedDTO,
      ]
      const result = extractACItemProps(events, project)
      expect(result).toBeNull()
    })
  })
  describe('when the project is lauréat', () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project']

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
        const result = extractACItemProps(events, project)
        expect(result).toMatchObject({
          type: 'attestation-de-conformite',
          date: new Date('2025-01-01').getTime(),
        })
      })
    })

    describe('when there is a CovidDelayGranted event', () => {
      it('should return props with covid delay and the latest due date', () => {
        const events = [
          {
            type: 'ProjectCompletionDueDateSet',
            date: 3,
            variant: 'admin',
          } as ProjectCompletionDueDateSetDTO,
          {
            type: 'CovidDelayGranted',
            date: 2,
            variant: 'admin',
          } as CovidDelayGrantedDTO,
          {
            type: 'ProjectCompletionDueDateSet',
            date: 1,
            variant: 'admin',
          } as ProjectCompletionDueDateSetDTO,
        ]

        const result = extractACItemProps(events, project)
        expect(result).toMatchObject({
          type: 'attestation-de-conformite',
          date: 3,
          covidDelay: true,
        })
      })
    })
  })
  describe('when the project is Eliminé', () => {
    const project = {
      status: 'Eliminé',
    } as ProjectEventListDTO['project']

    it('should return null', () => {
      const events = [
        {
          type: 'ProjectCompletionDueDateSet',
          date: new Date('2024-01-01').getTime(),
          variant: 'admin',
        } as ProjectCompletionDueDateSetDTO,
      ]
      const result = extractACItemProps(events, project)
      expect(result).toBeNull()
    })
  })
  describe('when the project is Abandonné', () => {
    const project = {
      status: 'Abandonné',
    } as ProjectEventListDTO['project']

    it('should return null', () => {
      const events = [
        {
          type: 'ProjectCompletionDueDateSet',
          date: new Date('2024-01-01').getTime(),
          variant: 'admin',
        } as ProjectCompletionDueDateSetDTO,
      ]
      const result = extractACItemProps(events, project)
      expect(result).toBeNull()
    })
  })
})
