import {
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
  ProjectNotifiedDTO,
} from '../../../../modules/frise'
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
        type: 'garantiesFinancieres',
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
        } as ProjectGFSubmittedDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
      expect(result).toEqual({
        date: submittedDate,
        type: 'garantiesFinancieres',
        status: 'submitted',
        url: expect.anything(),
        role: 'porteur-projet',
      })
    })
  })
  describe('when there is a ProjectGFDueDateSet event after a ProjectGFSubmitted event', () => {
    it('should return the due status', () => {
      const events = [
        {
          type: 'ProjectGFSubmitted',
          variant: 'porteur-projet',
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
        type: 'garantiesFinancieres',
        status: 'due',
        role: 'porteur-projet',
      })
    })
  })
})
