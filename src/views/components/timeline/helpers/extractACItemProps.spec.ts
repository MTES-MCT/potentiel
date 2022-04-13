import {
  CovidDelayGrantedDTO,
  DemandeDelaiSignaledDTO,
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
    describe('when there is some DemandeDelaiSignaled event with a due date applicable later than the due date', () => {
      it('should return the latest new due date', () => {
        const events = [
          {
            type: 'ProjectCompletionDueDateSet',
            date: new Date('2024-01-01').getTime(),
            variant: 'admin',
          } as ProjectCompletionDueDateSetDTO,
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: true,
            isNewDateApplicable: true,
            newCompletionDueOn: new Date('2024-06-30').getTime(),
          } as DemandeDelaiSignaledDTO,
          {
            type: 'ProjectCompletionDueDateSet',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
          } as ProjectCompletionDueDateSetDTO,
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: false,
            isNewDateApplicable: false,
            newCompletionDueOn: new Date('2024-07-31').getTime(),
          } as DemandeDelaiSignaledDTO,
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: true,
            isNewDateApplicable: true,
            newCompletionDueOn: new Date('2025-02-01').getTime(),
          } as DemandeDelaiSignaledDTO,
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: true,
            isNewDateApplicable: true,
            newCompletionDueOn: new Date('2026-01-01').getTime(),
          } as DemandeDelaiSignaledDTO,
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: true,
            isNewDateApplicable: false,
            newCompletionDueOn: new Date('2023-01-01').getTime(),
          } as DemandeDelaiSignaledDTO,
        ]
        const result = extractACItemProps(events, project)
        expect(result).toMatchObject({
          type: 'attestation-de-conformite',
          date: new Date('2026-01-01').getTime(),
        })
      })
    })
    describe('when there is some DemandeDelaiSignaled event with a due date applicable earlier than the due date', () => {
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
          {
            type: 'DemandeDelaiSignaled',
            date: new Date('2025-01-01').getTime(),
            variant: 'admin',
            isAccepted: true,
            isNewDateApplicable: true,
            newCompletionDueOn: new Date('2023-01-01').getTime(),
          } as DemandeDelaiSignaledDTO,
        ]
        const result = extractACItemProps(events, project)
        expect(result).toMatchObject({
          type: 'attestation-de-conformite',
          date: new Date('2025-01-01').getTime(),
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
