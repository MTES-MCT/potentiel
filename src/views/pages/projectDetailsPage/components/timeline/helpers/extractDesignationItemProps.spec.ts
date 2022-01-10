import { UniqueEntityID } from '../../../../../../core/domain'
import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise'
import { extractDesignationItemProps } from './extractDesignationItemProps'

describe('extractDesignationItemProps.spec', () => {
  const projectId = new UniqueEntityID().toString()

  describe(`when there is NOT a ProjectNotified event`, () => {
    it('should return an empty array', () => {
      const projectEventList: ProjectEventDTO[] = [
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
      expect(result).toEqual({ type: 'designation', date: 12 })
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
          certificate: { date: 13, source: 'generated', url: expect.anything() },
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
          certificate: { date: 14, source: 'generated', url: expect.anything() },
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
          certificate: { date: 13, source: 'uploaded', url: expect.anything() },
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
          certificate: { date: 13, source: 'uploaded', url: expect.anything() },
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
          certificate: { date: 14, source: 'uploaded', url: expect.anything() },
        })
      })
    })
  })
})
