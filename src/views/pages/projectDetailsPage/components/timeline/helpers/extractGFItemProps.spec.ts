import {
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise'
import { extractGFItemProps } from './extractGFItemProps'

describe('extractGFitemProps', () => {
  describe('when there is a ProjectGFDueDateSet event', () => {
    it('should return the GF due date', () => {
      const dueDate = new Date('2022-01-09').getTime()
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: dueDate,
        } as ProjectGFDueDateSetDTO,
      ]
      const result = extractGFItemProps(events, new Date('2022-01-08').getTime())
      expect(result).toEqual({
        date: dueDate,
        type: 'garantiesFinancieres',
        status: 'due',
        role: 'porteur-projet',
      })
    })
    describe('when the due date has passed', () => {
      it('should return a "hasPassed" status', () => {
        const events = [
          {
            type: 'ProjectGFDueDateSet',
            variant: 'porteur-projet',
            date: new Date('2022-01-09').getTime(),
          } as ProjectGFDueDateSetDTO,
        ]
        const result = extractGFItemProps(events, new Date('2022-01-10').getTime())
        expect(result).toMatchObject({
          status: 'hasPassed',
        })
      })
    })
  })
  describe('when there is a ProjectGFSubmitted event', () => {
    it('should return the GF submitted', () => {
      const submittedDate = new Date('2022-01-01').getTime()
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-10').getTime(),
        } as ProjectNotifiedDTO,
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
})
