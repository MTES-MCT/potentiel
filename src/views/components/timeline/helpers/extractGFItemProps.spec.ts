import {
  ProjectGFDueDateSetDTO,
  ProjectGFInvalidatedDTO,
  ProjectGFRemovedDTO,
  ProjectGFSubmittedDTO,
  ProjectGFValidatedDTO,
  ProjectNotifiedDTO,
} from '@modules/frise'
import { extractGFItemProps } from './extractGFItemProps'

describe('extractGFitemProps', () => {
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
      const result = extractGFItemProps(events, new Date('2022-01-08').getTime())
      expect(result).toEqual({
        date: new Date('2022-01-12').getTime(),
        type: 'garanties-financieres',
        status: 'due',
        role: 'porteur-projet',
        validationStatus: 'non-applicable',
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
        const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
        expect(result).toMatchObject({
          status: 'past-due',
        })
      })
    })
  })
  describe('when there is a ProjectGFSubmitted event after a ProjectGFDueDateSet event', () => {
    it('should return the GF submitted', () => {
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
          filename: 'file-name',
        } as ProjectGFSubmittedDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
      expect(result).toEqual({
        date: submittedDate,
        type: 'garanties-financieres',
        status: 'submitted',
        url: expect.anything(),
        role: 'porteur-projet',
        validationStatus: 'à traiter',
      })
    })
    describe('when there is no filename', () => {
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
        const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
        expect(result).toEqual({
          date: submittedDate,
          type: 'garanties-financieres',
          status: 'submitted',
          url: undefined,
          role: 'porteur-projet',
          validationStatus: 'à traiter',
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
          filename: 'file-name',
          date: new Date('2022-01-01').getTime(),
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-10').getTime(),
        } as ProjectGFDueDateSetDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
      expect(result).toEqual({
        date: new Date('2022-02-10').getTime(),
        type: 'garanties-financieres',
        status: 'due',
        role: 'porteur-projet',
        validationStatus: 'non-applicable',
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
      const result = extractGFItemProps(events, new Date('2022-01-11').getTime())
      expect(result).toEqual({
        date: new Date('2022-03-10').getTime(),
        type: 'garanties-financieres',
        status: 'due',
        role: 'porteur-projet',
        validationStatus: 'non-applicable',
      })
    })
  })
  describe('when there is a ProjectGFRemoved event followed by a ProjectFGSubmitted', () => {
    it('should return the latest submitted', () => {
      const events = [
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-10').getTime(),
        } as ProjectGFDueDateSetDTO,
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
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
          filename: 'file-name',
          date: new Date('2022-01-01').getTime(),
        } as ProjectGFSubmittedDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-11').getTime())
      expect(result).toEqual({
        date: new Date('2022-01-01').getTime(),
        type: 'garanties-financieres',
        status: 'submitted',
        role: 'porteur-projet',
        url: expect.anything(),
        validationStatus: 'à traiter',
      })
    })
  })

  describe('when there is a ProjectGFValidated', () => {
    it('should return latest ProjectGFSubmitted props with a "validé" validation status', () => {
      const events = [
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2021-12-10').getTime(),
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2021-12-01').getTime(),
          filename: 'file-name',
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFValidated',
          variant: 'porteur-projet',
          date: new Date('2022-01-14').getTime(),
          newStatus: 'validé',
          stepType: 'garantie-financiere',
        } as ProjectGFValidatedDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-20').getTime())
      expect(result).not.toBeNull()
      expect(result).toEqual({
        date: new Date('2021-12-01').getTime(),
        type: 'garanties-financieres',
        status: 'submitted',
        role: 'porteur-projet',
        url: expect.anything(),
        validationStatus: 'validée',
      })
    })
  })
  describe('when there is a ProjectGFInvalidated', () => {
    it('should return latest ProjectGFSubmitted props with a "à traiter" validation status', () => {
      const events = [
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
          filename: 'file-name',
          date: new Date('2021-12-10').getTime(),
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
          filename: 'file-name',
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
      const result = extractGFItemProps(events, new Date('2022-01-20').getTime())
      expect(result).not.toBeNull()
      expect(result).toEqual({
        date: new Date('2021-12-01').getTime(),
        type: 'garanties-financieres',
        status: 'submitted',
        role: 'porteur-projet',
        url: expect.anything(),
        validationStatus: 'à traiter',
      })
    })
  })
})
