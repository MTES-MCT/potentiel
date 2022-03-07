import {
  ProjectGFDueDateSetDTO,
  ProjectGFInvalidatedDTO,
  ProjectGFRemovedDTO,
  ProjectGFSubmittedDTO,
  ProjectGFUploadedDTO,
  ProjectGFValidatedDTO,
  ProjectGFWithdrawnDTO,
  ProjectNotifiedDTO,
} from '@modules/frise'
import { extractGFItemProps } from './extractGFItemProps'

describe('extractGFitemProps', () => {
  describe(`when the project is not lauréat`, () => {
    const project = {
      isLaureat: false,
      isSoumisAuxGF: true,
    }

    it(`should return null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
      expect(result).toEqual(null)
    })
  })
  describe('when the project is lauréat', () => {
    const project = {
      isLaureat: true,
      isSoumisAuxGF: true,
    }
    describe('when there is no event', () => {
      it('should return null', () => {
        const events = []
        const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
        expect(result).toBeNull()
      })
    })
    describe('when there is no ProjectGF* event', () => {
      describe('when the GF has already been submitted at application', () => {
        it('should return a "submitted-with-application" GFItemProps with no date', () => {
          const project = {
            isLaureat: true,
            isSoumisAuxGF: true,
            isGarantiesFinancieresDeposeesALaCandidature: true,
          }
          const events = [
            {
              type: 'ProjectNotified',
              variant: 'porteur-projet',
              date: new Date('2022-01-09').getTime(),
            } as ProjectNotifiedDTO,
          ]
          const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
          expect(result).toEqual({
            type: 'garanties-financieres',
            status: 'submitted-with-application',
            role: 'porteur-projet',
          })
        })
      })
      describe('when the project is not subject to GF', () => {
        it('should return a null', () => {
          const project = {
            isLaureat: true,
            isSoumisAuxGF: false,
          }
          const events = [
            {
              type: 'ProjectNotified',
              variant: 'porteur-projet',
              date: new Date('2022-01-09').getTime(),
            } as ProjectNotifiedDTO,
          ]
          const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
          expect(result).toEqual(null)
        })
      })
    })
    describe('when there is a ProjectGFUploaded event', () => {
      it('should return a "uploaded" status', () => {
        const project = {
          isLaureat: true,
          isSoumisAuxGF: true,
          isGarantiesFinancieresDeposeesALaCandidature: true,
        }
        const events = [
          {
            type: 'ProjectGFUploaded',
            variant: 'porteur-projet',
            date: new Date('2022-01-09').getTime(),
            file: { id: 'file-id', name: 'file-name' },
          } as ProjectGFUploadedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-01-09').getTime(),
          type: 'garanties-financieres',
          status: 'uploaded',
          role: 'porteur-projet',
          url: '/telechargement/file-id/fichier/file-name',
        })
      })
    })
    describe('when there is a ProjectGFWithdrawn event', () => {
      it('should return a "submitted-with-application" status', () => {
        const project = {
          isLaureat: true,
          isSoumisAuxGF: true,
          isGarantiesFinancieresDeposeesALaCandidature: true,
        }
        const events = [
          {
            type: 'ProjectGFWithdrawn',
            variant: 'porteur-projet',
            date: new Date('2022-01-10').getTime(),
          } as ProjectGFWithdrawnDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
        expect(result).toEqual({
          date: undefined,
          type: 'garanties-financieres',
          status: 'submitted-with-application',
          role: 'porteur-projet',
        })
      })
    })
    describe('when there are several ProjectGFDueDateSet events', () => {
      it('should return the GF due date', () => {
        const events = [
          {
            type: 'ProjectNotified',
            variant: 'admin',
            date: new Date('2022-01-09').getTime(),
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-02').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-12').getTime(),
          } as ProjectGFDueDateSetDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-08').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-01-12').getTime(),
          type: 'garanties-financieres',
          status: 'due',
          role: 'porteur-projet',
        })
      })
      describe('when the due date has passed', () => {
        it('should return a "past-due" status', () => {
          const events = [
            {
              type: 'ProjectGFDueDateSet',
              variant: 'porteur-projet',
              date: new Date('2022-01-09').getTime(),
            } as ProjectGFDueDateSetDTO,
          ]
          const result = extractGFItemProps(events, new Date('2022-01-10').getTime(), project)
          expect(result).toMatchObject({
            status: 'past-due',
          })
        })
      })
    })
    describe('when there is a ProjectGFSubmitted event after a ProjectGFDueDateSet event', () => {
      it('should return the GF pending for validation', () => {
        const submittedDate = new Date('2022-01-01').getTime()
        const events = [
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-03-10').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            date: submittedDate,
            file: { id: 'file-id', name: 'file-name' },
          } as ProjectGFSubmittedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toEqual({
          date: submittedDate,
          type: 'garanties-financieres',
          status: 'pending-validation',
          url: '/telechargement/file-id/fichier/file-name',
          role: 'porteur-projet',
        })
      })
      describe('when there is no file', () => {
        it('should return undefined for the url prop', () => {
          const submittedDate = new Date('2022-01-01').getTime()
          const events = [
            {
              type: 'ProjectGFDueDateSet',
              variant: 'porteur-projet',
              date: new Date('2022-03-10').getTime(),
            } as ProjectGFDueDateSetDTO,
            {
              type: 'ProjectGFSubmitted',
              variant: 'porteur-projet',
              date: submittedDate,
            } as ProjectGFSubmittedDTO,
          ]
          const result = extractGFItemProps(events, new Date('2022-01-10').getTime(), project)
          expect(result).toEqual({
            date: submittedDate,
            type: 'garanties-financieres',
            status: 'pending-validation',
            url: undefined,
            role: 'porteur-projet',
          })
        })
      })
    })
    describe('when there is a ProjectGFDueDateSet event after a ProjectGFSubmitted event', () => {
      it('should return the due status', () => {
        const events = [
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            file: { id: 'file-id', name: 'file-name' },
            date: new Date('2022-01-01').getTime(),
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-02-10').getTime(),
          } as ProjectGFDueDateSetDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-10').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-02-10').getTime(),
          type: 'garanties-financieres',
          status: 'due',
          role: 'porteur-projet',
        })
      })
    })
    describe('when there is a ProjectGFRemoved event after two ProjectGFDueDateSet events', () => {
      it('should return the latest due date', () => {
        const events = [
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-02-10').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            date: new Date('2022-01-01').getTime(),
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-03-10').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFRemoved',
            variant: 'porteur-projet',
            date: new Date('2022-01-02').getTime(),
          } as ProjectGFRemovedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-11').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-03-10').getTime(),
          type: 'garanties-financieres',
          status: 'due',
          role: 'porteur-projet',
        })
      })
    })
    describe('when there is a ProjectGFRemoved event followed by a ProjectFGSubmitted', () => {
      it('should return the latest submitted as pending for validation', () => {
        const events = [
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-02-10').getTime(),
          } as ProjectGFDueDateSetDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            file: { id: 'file-id', name: 'file-name' },
            date: new Date('2021-12-01').getTime(),
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFRemoved',
            variant: 'porteur-projet',
            date: new Date('2022-01-02').getTime(),
          } as ProjectGFRemovedDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            file: { id: 'file-id', name: 'file-name' },
            date: new Date('2022-01-01').getTime(),
          } as ProjectGFSubmittedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-11').getTime(), project)
        expect(result).toEqual({
          date: new Date('2022-01-01').getTime(),
          type: 'garanties-financieres',
          status: 'pending-validation',
          role: 'porteur-projet',
          url: '/telechargement/file-id/fichier/file-name',
        })
      })
    })

    describe('when there is a ProjectGFValidated', () => {
      it('should return latest ProjectGFSubmitted props as validated', () => {
        const events = [
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            date: new Date('2021-12-10').getTime(),
            file: { id: 'file-id', name: 'file-name' },
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            date: new Date('2021-12-01').getTime(),
            file: { id: 'file-id', name: 'file-name' },
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFValidated',
            variant: 'porteur-projet',
            date: new Date('2022-01-14').getTime(),
            newStatus: 'validé',
            stepType: 'garantie-financiere',
          } as ProjectGFValidatedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-20').getTime(), project)
        expect(result).not.toBeNull()
        expect(result).toEqual({
          date: new Date('2021-12-01').getTime(),
          type: 'garanties-financieres',
          status: 'validated',
          role: 'porteur-projet',
          url: '/telechargement/file-id/fichier/file-name',
        })
      })
    })
    describe('when there is a ProjectGFInvalidated', () => {
      it('should return latest ProjectGFSubmitted props as pending for validation', () => {
        const events = [
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            file: { id: 'file-id', name: 'file-name' },
            date: new Date('2021-12-10').getTime(),
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFSubmitted',
            variant: 'porteur-projet',
            file: { id: 'file-id', name: 'file-name' },
            date: new Date('2021-12-01').getTime(),
          } as ProjectGFSubmittedDTO,
          {
            type: 'ProjectGFValidated',
            variant: 'porteur-projet',
            date: new Date('2022-01-14').getTime(),
          } as ProjectGFValidatedDTO,
          {
            type: 'ProjectGFInvalidated',
            variant: 'porteur-projet',
            date: new Date('2022-01-15').getTime(),
          } as ProjectGFInvalidatedDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-20').getTime(), project)
        expect(result).not.toBeNull()
        expect(result).toEqual({
          date: new Date('2021-12-01').getTime(),
          type: 'garanties-financieres',
          status: 'pending-validation',
          role: 'porteur-projet',
          url: expect.anything(),
        })
      })
    })
  })
})
