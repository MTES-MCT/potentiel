import {
  ProjectDCRDueDateSetDTO,
  ProjectDCRSubmittedDTO,
  ProjectNotifiedDTO,
} from '../../../../modules/frise'
import { extractDCRItemProps } from './extractDCRItemProps'

describe('extractDCRitemProps', () => {
  describe('when there are several ProjectDCRDueDateSet events', () => {
    it('should return the DCR date', () => {
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
      const result = extractDCRItemProps(events, new Date('2022-01-08').getTime())
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
        const result = extractDCRItemProps(events, new Date('2022-01-10').getTime())
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
        } as ProjectDCRSubmittedDTO,
      ]
      const result = extractDCRItemProps(events, new Date('2022-01-10').getTime())
      expect(result).toEqual({
        date: submittedDate,
        type: 'demande-complete-de-raccordement',
        status: 'submitted',
        url: expect.anything(),
        role: 'porteur-projet',
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
      const result = extractDCRItemProps(events, new Date('2022-01-10').getTime())
      expect(result).toEqual({
        date: new Date('2022-02-10').getTime(),
        type: 'demande-complete-de-raccordement',
        status: 'due',
        role: 'porteur-projet',
      })
    })
  })
})
