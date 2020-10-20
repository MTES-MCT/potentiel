import { DomainError } from '../../../core/domain'
import { errAsync, okAsync } from '../../../core/utils'
import { StoredEvent } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
import { ProjectCertificateUpdated, ProjectDataCorrected } from '../events'
import { ProjectNotEligibleForCertificateError } from '../generateCertificate'
import { handleProjectDataCorrected } from './handleProjectDataCorrected'

const eventBus = {
  publish: jest.fn((event: StoredEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  ),
  subscribe: jest.fn(),
}

describe('handleProjectDataCorrected', () => {
  describe('when payload does not have certificateFileId', () => {
    describe('when periode enables generating a certificate', () => {
      const generateCertificate = jest.fn((projectId: string) =>
        okAsync<string, DomainError>('generatedFileId1')
      )

      const fakePayload = {
        projectId: 'project1',
        notifiedOn: 1,
        correctedData: {},
      }

      beforeAll(async () => {
        eventBus.publish.mockClear()

        await handleProjectDataCorrected({
          eventBus,
          generateCertificate,
        })(
          new ProjectDataCorrected({
            payload: fakePayload,
            requestId: 'request1',
          })
        )
      })

      it('should generate a new certificate', () => {
        expect(generateCertificate).toHaveBeenCalled()
      })

      it('should trigger ProjectCertificateUpated with the new certificateFileId', () => {
        expect(eventBus.publish).toHaveBeenCalled()

        const projectCertificateUpdatedEvent = eventBus.publish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectCertificateUpdated.type)

        expect(projectCertificateUpdatedEvent).toBeDefined()
        if (!projectCertificateUpdatedEvent) return

        expect(
          (projectCertificateUpdatedEvent.payload as any).projectId
        ).toEqual(fakePayload.projectId)
        expect(
          (projectCertificateUpdatedEvent.payload as any).certificateFileId
        ).toEqual('generatedFileId1')

        expect(projectCertificateUpdatedEvent.aggregateId).toEqual(
          fakePayload.projectId
        )
      })
    })

    describe('when periode does not enable generating a certificate', () => {
      const generateCertificate = jest.fn((projectId: string) =>
        errAsync<string, DomainError>(
          new ProjectNotEligibleForCertificateError()
        )
      )

      const fakePayload = {
        projectId: 'project1',
        notifiedOn: 1,
        correctedData: {},
      }

      it('should not trigger any event', async () => {
        eventBus.publish.mockClear()

        await handleProjectDataCorrected({
          eventBus,
          generateCertificate,
        })(
          new ProjectDataCorrected({
            payload: fakePayload,
            requestId: 'request1',
          })
        )

        expect(eventBus.publish).not.toHaveBeenCalled()
      })
    })
  })

  describe('when payload has a certificateFileId', () => {
    it('should trigger ProjectCertificateUpdated with that certificateFileId', async () => {
      const generateCertificate = jest.fn((projectId: string) =>
        okAsync<string, DomainError>('fileId1')
      )

      const fakePayload = {
        projectId: 'project1',
        certificateFileId: 'file1',
        notifiedOn: 1,
        correctedData: {},
      }

      eventBus.publish.mockClear()

      await handleProjectDataCorrected({
        eventBus,
        generateCertificate,
      })(
        new ProjectDataCorrected({
          payload: fakePayload,
          requestId: 'request1',
        })
      )

      expect(generateCertificate).not.toHaveBeenCalled()

      expect(eventBus.publish).toHaveBeenCalled()

      const projectCertificateUpdatedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateUpdated.type)

      expect(projectCertificateUpdatedEvent).toBeDefined()
      if (!projectCertificateUpdatedEvent) return

      expect((projectCertificateUpdatedEvent.payload as any).projectId).toEqual(
        fakePayload.projectId
      )
      expect(
        (projectCertificateUpdatedEvent.payload as any).certificateFileId
      ).toEqual(fakePayload.certificateFileId)

      expect(projectCertificateUpdatedEvent.aggregateId).toEqual(
        fakePayload.projectId
      )
    })
  })
})
