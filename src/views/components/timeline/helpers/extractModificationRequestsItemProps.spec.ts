import { UniqueEntityID } from '@core/domain'
import { ProjectEventDTO, ProjectNotifiedDTO } from '@modules/frise'
import { extractModificationRequestsItemProps } from './extractModificationRequestsItemProps'

describe('extractModificationRequestItemProps', () => {
  describe('when there is no event at all', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = []
      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there is no ModificationRequests* event', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: 12,
        } as ProjectNotifiedDTO,
      ]
      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there are some ModificationRequestXxxed events without a ModificationRequested', () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
        {
          type: 'ModificationRequestCancelled',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
        {
          type: 'ModificationRequestConfirmed',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: new UniqueEntityID().toString(),
        },
      ]
      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(0)
    })
  })
  describe('when there are several ModificationRequested events with different modificationRequestId', () => {
    it('should return an array with props for each modification request id', () => {
      const firstModificationRequestId = new UniqueEntityID().toString()
      const secondModificationRequestId = new UniqueEntityID().toString()
      const thirdModificationRequestId = new UniqueEntityID().toString()
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          modificationRequestId: firstModificationRequestId,
          delayInMonths: 9,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: firstModificationRequestId,
        },
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'abandon',
          modificationRequestId: secondModificationRequestId,
          authority: 'dreal',
        },
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'recours',
          modificationRequestId: thirdModificationRequestId,
          authority: 'dreal',
        },
      ]
      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(3)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          delayInMonths: 9,
          status: 'rejetée',
          modificationType: 'delai',
          authority: 'dgec',
          role: 'porteur-projet',
        },
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-09').getTime(),
          status: 'envoyée',
          modificationType: 'abandon',
          authority: 'dreal',
          role: 'porteur-projet',
        },
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-09').getTime(),
          status: 'envoyée',
          modificationType: 'recours',
          authority: 'dreal',
          role: 'porteur-projet',
        },
      ])
    })
  })
  describe('when there is a ModificationRequestAccepted event', () => {
    it('should return an "acceptée" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          modificationRequestId: modificationRequestId,
          delayInMonths: 9,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
          file: { id: 'fileid', name: 'filename' },
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          delayInMonths: 9,
          status: 'acceptée',
          modificationType: 'delai',
          authority: 'dgec',
          role: 'porteur-projet',
          url: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a ModificationRequestRejected event', () => {
    it('should return a "rejetée" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          modificationRequestId: modificationRequestId,
          delayInMonths: 9,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
          file: { id: 'fileid', name: 'filename' },
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          delayInMonths: 9,
          status: 'rejetée',
          modificationType: 'delai',
          authority: 'dgec',
          role: 'porteur-projet',
          url: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a ModificationRequestInstructionStarted event', () => {
    it('should return an "en instruction" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          modificationRequestId: modificationRequestId,
          delayInMonths: 9,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          delayInMonths: 9,
          status: 'en instruction',
          modificationType: 'delai',
          authority: 'dgec',
          role: 'porteur-projet',
        },
      ])
    })
  })

  describe('when there is a ModificationRequestCancelled event', () => {
    it('should return an "annulée" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          modificationRequestId: modificationRequestId,
          delayInMonths: 9,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestCancelled',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          delayInMonths: 9,
          status: 'annulée',
          modificationType: 'delai',
          authority: 'dgec',
          role: 'porteur-projet',
        },
      ])
    })
  })

  describe('when there is a ConfirmationRequested event', () => {
    it('should return a "en attente de confirmation" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'recours',
          modificationRequestId: modificationRequestId,
          authority: 'dgec',
        },
        {
          type: 'ConfirmationRequested',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
          file: { id: 'fileid', name: 'filename' },
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          status: 'en attente de confirmation',
          modificationType: 'recours',
          authority: 'dgec',
          role: 'porteur-projet',
          url: expect.anything(),
        },
      ])
    })
  })

  describe('when there is a ModificationRequestConfirmed event', () => {
    it('should return a "demande confirmée" status', () => {
      const modificationRequestId = new UniqueEntityID().toString()

      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ModificationRequested',
          date: new Date('2022-02-09').getTime(),
          variant: 'porteur-projet',
          modificationType: 'abandon',
          modificationRequestId: modificationRequestId,
          authority: 'dgec',
        },
        {
          type: 'ModificationRequestConfirmed',
          date: new Date('2022-02-10').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: modificationRequestId,
        },
      ]

      const result = extractModificationRequestsItemProps(projectEventList)
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          type: 'demande-de-modification',
          date: new Date('2022-02-10').getTime(),
          status: 'demande confirmée',
          modificationType: 'abandon',
          authority: 'dgec',
          role: 'porteur-projet',
        },
      ])
    })
  })
})
