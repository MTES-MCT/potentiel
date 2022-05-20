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
import { USER_ROLES } from '@modules/users'
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

  describe('when the project is notified but there is no certificate event', () => {
    const projectNotifiedEvent = {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 12,
    } as ProjectNotifiedDTO

    it('should return the notification date and a certificate undefined', () => {
      const result = extractDesignationItemProps([projectNotifiedEvent], projectId)
      expect(result).toEqual({
        type: 'designation',
        date: 12,
        certificate: undefined,
        role: 'admin',
      })
    })

    describe('when isLegacy is true', () => {
      describe('when user is not dreal', () => {
        for (const role of USER_ROLES.filter((role) => role !== 'dreal')) {
          it('should return a not applicable certificate status', () => {
            const projectEventList = [
              {
                type: 'ProjectNotified',
                variant: role,
                date: 12,
                isLegacy: true,
              } as ProjectNotifiedDTO,
            ]

            const result = extractDesignationItemProps(projectEventList, projectId)
            expect(result).toMatchObject({
              certificate: { status: 'not-applicable' },
            })
          })
        }
      })
      describe('when user is dreal', () => {
        it('should return an undefined certificate', () => {
          const projectEventList = [
            {
              type: 'ProjectNotified',
              variant: 'dreal',
              date: 12,
              isLegacy: true,
            } as ProjectNotifiedDTO,
          ]

          const result = extractDesignationItemProps(projectEventList, projectId)
          expect(result).toMatchObject({
            certificate: undefined,
          })
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
  })
})
