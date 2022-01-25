import { UniqueEntityID } from '@core/domain'
import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectImportedDTO,
  ProjectNotificationDateSetDTO,
  ProjectNotifiedDTO,
} from '@modules/frise'
import { extractDesignationItemProps } from './extractDesignationItemProps'

describe('extractDesignationItemProps', () => {
  const projectId = new UniqueEntityID().toString()

  describe(`when there is neither a ProjectImported with a notification date nor a ProjectNotified`, () => {
    it('should return null', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: 11,
        } as ProjectImportedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: 13,
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectCertificateRegenerated',
          variant: 'admin',
          date: 13,
        } as ProjectCertificateRegeneratedDTO,
        {
          type: 'ProjectCertificateUpdated',
          variant: 'admin',
          date: 13,
        } as ProjectCertificateUpdatedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
          date: 13,
        } as ProjectClaimedDTO,
      ]
      const result = extractDesignationItemProps(projectEventList, projectId)
      expect(result).toBeNull()
    })
  })

  describe('when there is a ProjectNotified event', () => {
    const projectNotifiedEvent = {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 12,
    } as ProjectNotifiedDTO

    it('should return the notification date', () => {
      const result = extractDesignationItemProps([projectNotifiedEvent], projectId)
      expect(result).toEqual({
        type: 'designation',
        date: 12,
        certificate: { status: 'pending' },
        role: 'admin',
      })
    })

    describe('when isLegacy is true', () => {
      it('should return a not applicable certificate status', () => {
        const withLegacy: ProjectNotifiedDTO = { ...projectNotifiedEvent, isLegacy: true }
        const projectEventList = [withLegacy]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { status: 'not-applicable' },
        })
      })
    })

    describe('when there is a ProjectCertificateGenerated event', () => {
      it('should return a certificate', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectCertificateGenerated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateGeneratedDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { date: 13, status: 'generated', url: expect.anything() },
        })
      })
    })

    describe('when there is both a ProjectCertificateGenerated event and a ProjectCertificateRegenerated event', () => {
      it('should return the regenerated certificate', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectCertificateGenerated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateGeneratedDTO,
          {
            type: 'ProjectCertificateRegenerated',
            variant: 'admin',
            date: 14,
          } as ProjectCertificateRegeneratedDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { date: 14, status: 'generated', url: expect.anything() },
        })
      })
    })

    describe('when there is a ProjectClaimed event', () => {
      it('should return the certificate from the claim', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectClaimed',
            variant: 'admin',
            date: 13,
          } as ProjectClaimedDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { date: 13, status: 'uploaded', url: expect.anything() },
        })
      })
    })

    describe('when there is a ProjectCertificateUpdated event', () => {
      it('should return the certificate from the update', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectCertificateUpdated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateUpdatedDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { date: 13, status: 'uploaded', url: expect.anything() },
        })
      })
    })

    describe('when there is both a ProjectCertificateGenerated event and then a ProjectCertificateUpdated event', () => {
      it('should return the updated certificate', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectCertificateGenerated',
            variant: 'admin',
            date: 13,
          } as ProjectCertificateGeneratedDTO,
          {
            type: 'ProjectCertificateUpdated',
            variant: 'admin',
            date: 14,
          } as ProjectCertificateUpdatedDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          certificate: { date: 14, status: 'uploaded', url: expect.anything() },
        })
      })
    })
    describe('when there are several ProjectNotificationDateSet events', () => {
      it(' it should return the latest ProjectNotificationDateSet date', () => {
        const projectEventList = [
          {
            type: 'ProjectNotified',
            variant: 'admin',
            date: new Date('2022-01-18').getTime(),
          } as ProjectNotifiedDTO,
          {
            type: 'ProjectNotificationDateSet',
            variant: 'admin',
            date: new Date('2022-01-19').getTime(),
          } as ProjectNotificationDateSetDTO,
          {
            type: 'ProjectNotificationDateSet',
            variant: 'admin',
            date: new Date('2022-01-20').getTime(),
          } as ProjectNotificationDateSetDTO,
        ]

        const result = extractDesignationItemProps(projectEventList, projectId)
        expect(result).toMatchObject({
          type: 'designation',
          date: new Date('2022-01-20').getTime(),
        })
      })
    })
  })
  describe('when user is DREAL', () => {
    it('should return certificate as undefined', () => {
      const projectEventList = [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: 12,
        } as ProjectNotifiedDTO,
      ]
      const result = extractDesignationItemProps(projectEventList, projectId)
      expect(result).toEqual({
        type: 'designation',
        date: 12,
        role: 'dreal',
        certificate: undefined,
      })
    })
  })
})
