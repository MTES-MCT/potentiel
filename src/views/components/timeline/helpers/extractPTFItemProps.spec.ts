import {
  ProjectPTFRemovedDTO,
  ProjectPTFSubmittedDTO,
  ProjectNotifiedDTO,
} from '../../../../modules/frise'
import { extractPTFItemProps } from './extractPTFItemProps'

describe('extractPTFitemProps', () => {
  describe('when there is no events', () => {
    it('should return null', () => {
      const events = []
      const result = extractPTFItemProps(events)
      expect(result).toBeNull()
    })
  })

  describe('when there is no ProjectPTF* events', () => {
    it('should return a not-submitted PTFItemProps with no date', () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ]
      const result = extractPTFItemProps(events)
      expect(result).toEqual({
        type: 'proposition-technique-et-financiere',
        status: 'not-submitted',
        role: 'porteur-projet',
      })
    })
  })
  describe('when there is a ProjectPTFSubmitted event after a ProjectPTFRemoved event', () => {
    it('should return the latest submitted date', () => {
      const events = [
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-07').getTime(),
          fileId: 'old-fileId',
          filename: 'old-filename',
        } as ProjectPTFSubmittedDTO,
        {
          type: 'ProjectPTFRemoved',
          variant: 'porteur-projet',
          date: new Date('2022-01-08').getTime(),
        } as ProjectPTFRemovedDTO,
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
          fileId: 'fileId',
          filename: 'filename',
        } as ProjectPTFSubmittedDTO,
      ]
      const result = extractPTFItemProps(events)

      expect(result).toEqual({
        date: new Date('2022-01-09').getTime(),
        type: 'proposition-technique-et-financiere',
        status: 'submitted',
        role: 'porteur-projet',
        url: '/telechargement/fileId/fichier/filename',
      })
    })
  })
  describe('when there is a ProjectPTFRemoved event after a ProjectPTFSubmitted event', () => {
    it('should return a not-submitted PTFItemProps with no date', () => {
      const events = [
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-07').getTime(),
        } as ProjectPTFSubmittedDTO,
        {
          type: 'ProjectPTFRemoved',
          variant: 'porteur-projet',
          date: new Date('2022-01-08').getTime(),
        } as ProjectPTFRemovedDTO,
      ]
      const result = extractPTFItemProps(events)
      expect(result).toEqual({
        type: 'proposition-technique-et-financiere',
        status: 'not-submitted',
        role: 'porteur-projet',
      })
    })
  })
  describe('when there is a ProjectPTFSubmitted event with no filename', () => {
    it('should return a submitted PTFItemProps with no url', () => {
      const events = [
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
          fileId: 'fileId',
        } as ProjectPTFSubmittedDTO,
      ]
      const result = extractPTFItemProps(events)

      expect(result).toEqual({
        date: new Date('2022-01-09').getTime(),
        type: 'proposition-technique-et-financiere',
        status: 'submitted',
        role: 'porteur-projet',
      })
    })
  })
})
