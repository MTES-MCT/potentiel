import { DomainError } from '../../../core/domain'
import { errAsync, okAsync } from '../../../core/utils'
import { CandidateNotification } from '../../candidateNotification/CandidateNotification'
import { StoredEvent } from '../../eventStore'
import { InfraNotAvailableError, OtherError } from '../../shared'
import { ProjectNotified } from '../events'
import { ProjectCertificateGenerated } from '../events/ProjectCertificateGenerated'
import { ProjectCertificateGenerationFailed } from '../events/ProjectCertificateGenerationFailed'
import { handleProjectNotified } from './'

const eventBus = {
  publish: jest.fn((event: StoredEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  ),
  subscribe: jest.fn(),
}

describe('handleProjectNotified', () => {
  describe('when generateCertificate succeeds', () => {
    const generateCertificate = jest.fn((projectId: string) =>
      okAsync<string, DomainError>('fileId1')
    )
    const getFamille = jest.fn()

    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      notifiedOn: 0,
      familleId: 'famille1',
    }

    let projectCertificateGeneratedEvent: StoredEvent | undefined = undefined

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleProjectNotified({
        eventBus,
        generateCertificate,
        getFamille,
      })(
        new ProjectNotified({
          payload: fakePayload,
          requestId: 'request1',
        })
      )
    })

    it('should call generateCertificate with the projectId', () => {
      expect(generateCertificate).toHaveBeenCalledWith(
        fakePayload.projectId,
        fakePayload.notifiedOn
      )
    })

    it('should trigger ProjectCertificateGenerated event', () => {
      expect(eventBus.publish).toHaveBeenCalled()
      const projectCertificateGeneratedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateGenerated.type)

      expect(projectCertificateGeneratedEvent).toBeDefined()
      if (!projectCertificateGeneratedEvent) return
      expect(projectCertificateGeneratedEvent.type).toEqual(
        ProjectCertificateGenerated.type
      )

      expect(
        (projectCertificateGeneratedEvent.payload as any).projectId
      ).toEqual(fakePayload.projectId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).appelOffreId
      ).toEqual(fakePayload.appelOffreId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).periodeId
      ).toEqual(fakePayload.periodeId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).certificateFileId
      ).toEqual('fileId1')
      expect(projectCertificateGeneratedEvent.requestId).toEqual('request1')
      expect(projectCertificateGeneratedEvent.aggregateId).toEqual([
        fakePayload.projectId,
        CandidateNotification.makeId(fakePayload),
      ])
    })
  })

  describe('when generateCertificate fails twice then succeeds', () => {
    let failCounter = 2
    const generateCertificate = jest.fn((projectId: string) =>
      failCounter-- > 0
        ? errAsync<string, DomainError>(new OtherError('test error'))
        : okAsync<string, DomainError>('fileId1')
    )
    const getFamille = jest.fn()

    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      familleId: 'famille1',
      notifiedOn: 0,
    }

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleProjectNotified({
        eventBus,
        generateCertificate,
        getFamille,
      })(new ProjectNotified({ payload: fakePayload }))
    })

    it('should retry calling generateCertificate with the projectId three times', () => {
      expect(generateCertificate).toHaveBeenCalledTimes(3)
    })

    it('should trigger ProjectCertificateGenerated event', () => {
      expect(eventBus.publish).toHaveBeenCalled()
      const projectCertificateGeneratedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateGenerated.type)

      expect(projectCertificateGeneratedEvent).toBeDefined()
      if (!projectCertificateGeneratedEvent) return
      expect(projectCertificateGeneratedEvent.type).toEqual(
        ProjectCertificateGenerated.type
      )

      expect(
        (projectCertificateGeneratedEvent.payload as any).projectId
      ).toEqual(fakePayload.projectId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).appelOffreId
      ).toEqual(fakePayload.appelOffreId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).periodeId
      ).toEqual(fakePayload.periodeId)
      expect(
        (projectCertificateGeneratedEvent.payload as any).certificateFileId
      ).toEqual('fileId1')
      expect(projectCertificateGeneratedEvent.aggregateId).toEqual([
        fakePayload.projectId,
        CandidateNotification.makeId(fakePayload),
      ])
    })

    it('should not trigger ProjectCertificateGenerationFailed event', () => {
      expect(eventBus.publish).toHaveBeenCalled()
      const projectCertificateFailedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateGenerationFailed.type)

      expect(projectCertificateFailedEvent).not.toBeDefined()
    })
  })

  describe('when generateCertificate keeps failing', () => {
    const generateCertificate = jest.fn((projectId: string) =>
      errAsync<string, DomainError>(new OtherError('test error'))
    )
    const getFamille = jest.fn()

    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      familleId: 'famille1',
      notifiedOn: 0,
    }

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleProjectNotified({
        eventBus,
        generateCertificate,
        getFamille,
      })(
        new ProjectNotified({
          payload: fakePayload,
          requestId: 'request1',
        })
      )
    })

    it('should retry calling generateCertificate with the projectId three times', () => {
      expect(generateCertificate).toHaveBeenCalledTimes(3)
    })

    it('should trigger ProjectCertificateGenerationFailed event', () => {
      expect(eventBus.publish).toHaveBeenCalled()
      const projectCertificateGenerationFailedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateGenerationFailed.type)

      expect(projectCertificateGenerationFailedEvent).toBeDefined()
      if (!projectCertificateGenerationFailedEvent) return
      expect(
        (projectCertificateGenerationFailedEvent.payload as any).error
      ).toEqual('test error')
      expect(
        (projectCertificateGenerationFailedEvent.payload as any).projectId
      ).toEqual(fakePayload.projectId)
      expect(
        (projectCertificateGenerationFailedEvent.payload as any).appelOffreId
      ).toEqual(fakePayload.appelOffreId)
      expect(
        (projectCertificateGenerationFailedEvent.payload as any).periodeId
      ).toEqual(fakePayload.periodeId)
      expect(projectCertificateGenerationFailedEvent.requestId).toEqual(
        'request1'
      )
      expect(projectCertificateGenerationFailedEvent.aggregateId).toEqual([
        fakePayload.projectId,
        CandidateNotification.makeId(fakePayload),
      ])
    })

    it('should not trigger ProjectCertificateGenerated event', () => {
      expect(eventBus.publish).toHaveBeenCalled()
      const projectCertificateGeneratedEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectCertificateGenerated.type)

      expect(projectCertificateGeneratedEvent).not.toBeDefined()
    })
  })
})
