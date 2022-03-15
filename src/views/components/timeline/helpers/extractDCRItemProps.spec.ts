import {
  ProjectDCRDueDateSetDTO,
  ProjectDCRRemovedDTO,
  ProjectDCRSubmittedDTO,
  ProjectEventListDTO,
  ProjectNotifiedDTO,
} from '@modules/frise'
import { extractDCRItemProps } from './extractDCRItemProps'

describe('extractDCRitemProps', () => {
  describe('when there is no ProjectDCR* events', () => {
    it('should return null', () => {
      const project = {
        status: 'Classé',
      } as ProjectEventListDTO['project']

      const events = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractDCRItemProps(events, new Date('2022-01-08').getTime(), project)
      expect(result).toBeNull()
    })
  })

  describe('when the project is Eliminé', () => {
    const project = {
      status: 'Eliminé',
    } as ProjectEventListDTO['project']

    it('should return null', () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractDCRItemProps(events, new Date('2022-01-08').getTime(), project)
      expect(result).toBeNull()
    })
  })

  describe('when the project is laureat', () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project']

    describe('when there are several ProjectDCRDueDateSet events', () => {
      it('should return the latest DCR date', () => {
        const events = [
          {
            type: 'ProjectNotified',
            variant: 'admin',
            date: new Date('2022-01-09').getTime(),
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectDCRDueDateSetDTO,
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-02').getTime(),
          } as ProjectDCRDueDateSetDTO,
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-12').getTime(),
          } as ProjectDCRDueDateSetDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-08').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-01-12').getTime(),
          type: 'demande-complete-de-raccordement',
          status: 'due',
          role: 'porteur-projet',
        })
      })
      describe('when the date has passed', () => {
        it('should return a "past-due" status', () => {
          const events = [
            {
              type: 'ProjectDCRDueDateSet',
              variant: 'porteur-projet',
              date: new Date('2022-01-09').getTime(),
            } as ProjectDCRDueDateSetDTO,
          ]
          const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
          expect(result).toMatchObject({
            status: 'past-due',
          })
        })
      })
    })
    describe('when there is a ProjectDCRSubmitted event after a ProjectDCRDueDateSet event', () => {
      it('should return the DCR submitted', () => {
        const submittedDate = new Date('2022-01-01').getTime()
        const events = [
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-03-10').getTime(),
          } as ProjectDCRDueDateSetDTO,
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: submittedDate,
            numeroDossier: 'DOSSIER-1',
            file: { id: 'file-id', name: 'file-name' },
          } as ProjectDCRSubmittedDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toEqual({
          date: submittedDate,
          type: 'demande-complete-de-raccordement',
          status: 'submitted',
          url: expect.anything(),
          role: 'porteur-projet',
          numeroDossier: 'DOSSIER-1',
        })
      })
    })
    describe('when there is a ProjectDCRDueDateSet event after a ProjectDCRSubmitted event', () => {
      it('should return the due status', () => {
        const events = [
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectDCRSubmittedDTO,
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-02-10').getTime(),
          } as ProjectDCRDueDateSetDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-02-10').getTime(),
          type: 'demande-complete-de-raccordement',
          status: 'due',
          role: 'porteur-projet',
        })
      })
    })
    describe('when there is a ProjectDCRSubmitted event after a ProjectDCRRemoved event', () => {
      it('should return the latest submitted date', () => {
        const events = [
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-07').getTime(),
            file: { id: 'old-fileId', name: 'old-filename' },
          } as ProjectDCRSubmittedDTO,
          {
            type: 'ProjectDCRRemoved',
            variant: 'porteur-projet',
            date: new Date('2022-01-08').getTime(),
          } as ProjectDCRRemovedDTO,
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-09').getTime(),
            file: { id: 'fileId', name: 'filename' },
          } as ProjectDCRSubmittedDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-01').getTime(), project)

        expect(result).toEqual({
          date: new Date('2022-01-09').getTime(),
          type: 'demande-complete-de-raccordement',
          status: 'submitted',
          role: 'porteur-projet',
          url: '/telechargement/fileId/fichier/filename',
        })
      })
    })
    describe('when there is a ProjectDCRRemoved event after a ProjectDCRSubmitted event', () => {
      it('should return the latest due date', () => {
        const events = [
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectDCRDueDateSetDTO,
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-03').getTime(),
          } as ProjectDCRSubmittedDTO,
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-05').getTime(),
          } as ProjectDCRDueDateSetDTO,
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-07').getTime(),
          } as ProjectDCRSubmittedDTO,
          {
            type: 'ProjectDCRRemoved',
            variant: 'porteur-projet',
            date: new Date('2022-01-08').getTime(),
          } as ProjectDCRRemovedDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-01').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-01-05').getTime(),
          type: 'demande-complete-de-raccordement',
          status: 'due',
          role: 'porteur-projet',
        })
      })
    })
  })

  describe('when the project is Abandonné', () => {
    const project = {
      status: 'Abandonné',
    } as ProjectEventListDTO['project']

    describe('when the DCR has not been submitted', () => {
      it('should return null', () => {
        const events = [
          {
            type: 'ProjectDCRDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-02-10').getTime(),
          } as ProjectDCRDueDateSetDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toBeNull()
      })
    })

    describe('when the DCR has been submitted', () => {
      it('should return DCR submitted props', () => {
        const events = [
          {
            type: 'ProjectDCRSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectDCRSubmittedDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toMatchObject({
          date: new Date('2022-01-01').getTime(),
          type: 'demande-complete-de-raccordement',
          status: 'submitted',
          role: 'porteur-projet',
        })
      })
    })

    describe('when the DCR has been removed', () => {
      it('should return null', () => {
        const events = [
          {
            type: 'ProjectDCRRemoved',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectDCRRemovedDTO,
        ]
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toBeNull()
      })
    })
  })
})
