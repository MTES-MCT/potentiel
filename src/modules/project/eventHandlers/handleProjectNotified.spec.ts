import moment from 'moment'
import { DomainError, Repository } from '../../../core/domain'
import { errAsync, okAsync } from '../../../core/utils'
import { AppelOffre, Famille } from '../../../entities'
import { InMemoryEventStore } from '../../../infra/inMemory'
import { GetFamille } from '../../appelOffre'
import { StoredEvent } from '../../eventStore'
import { OtherError } from '../../shared'
import {
  ProjectNotified,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
} from '../events'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGeneratedPayload,
} from '../events/ProjectCertificateGenerated'
import {
  ProjectCertificateGenerationFailed,
  ProjectCertificateGenerationFailedPayload,
} from '../events/ProjectCertificateGenerationFailed'
import { GenerateCertificate } from '../generateCertificate'
import { handleProjectNotified } from './'

describe('handleProjectNotified', () => {
  it('should trigger ProjectDCRDueDateSet', async () => {
    const eventStore = new InMemoryEventStore()

    const fakeFamille: Famille = {
      id: 'famille1',
      title: 'familletitle',
      garantieFinanciereEnMois: 0,
    }

    const generateCertificate: GenerateCertificate = jest.fn(() => okAsync(''))
    const getFamille: GetFamille = jest.fn((appelOffreId, familleId) =>
      okAsync(fakeFamille)
    )

    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      familleId: 'famille1',
      notifiedOn: 123456789,
    }

    const catchPromise: Promise<ProjectDCRDueDateSet> = new Promise(
      (resolve) => {
        eventStore.subscribe(
          ProjectDCRDueDateSet.type,
          (event: ProjectDCRDueDateSet) => {
            resolve(event)
          }
        )
      }
    )

    handleProjectNotified(eventStore, { generateCertificate, getFamille })

    await eventStore.publish(
      new ProjectNotified({ payload: fakePayload, requestId: 'request1' })
    )

    const caughtEvent = await catchPromise
    expect(caughtEvent.payload).toEqual({
      projectId: fakePayload.projectId,
      dcrDueOn: moment(fakePayload.notifiedOn)
        .add(2, 'months')
        .toDate()
        .getTime(),
    })
  })

  describe('updating garantie financiere', () => {
    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      familleId: 'famille1',
      notifiedOn: 123456789,
    }
    const generateCertificate: GenerateCertificate = jest.fn(() => okAsync(''))

    describe('when project family warrants garantie financiere', () => {
      const eventStore = new InMemoryEventStore()

      const fakeFamille: Famille = {
        id: 'famille1',
        title: 'familletitle',
        garantieFinanciereEnMois: 17,
      }

      const getFamille: GetFamille = jest.fn((appelOffreId, familleId) =>
        okAsync(fakeFamille)
      )

      it('should trigger ProjectGFDueDateSet', async () => {
        const catchPromise: Promise<ProjectGFDueDateSet> = new Promise(
          (resolve) => {
            eventStore.subscribe(
              ProjectGFDueDateSet.type,
              (event: ProjectGFDueDateSet) => {
                resolve(event)
              }
            )
          }
        )

        handleProjectNotified(eventStore, { generateCertificate, getFamille })

        await eventStore.publish(
          new ProjectNotified({ payload: fakePayload, requestId: 'request1' })
        )

        const caughtEvent = await catchPromise
        expect(caughtEvent.payload).toEqual({
          projectId: fakePayload.projectId,
          garantiesFinancieresDueOn: moment(fakePayload.notifiedOn)
            .add(2, 'months')
            .toDate()
            .getTime(),
        })

        expect(getFamille).toHaveBeenCalledWith(
          fakePayload.appelOffreId,
          fakePayload.familleId
        )
      })
    })

    describe('when project family does not warrant garantie financiere', () => {
      const eventStore = new InMemoryEventStore()

      const fakeFamille: Famille = {
        id: 'famille1',
        title: 'familletitle',
        garantieFinanciereEnMois: 0,
      }

      const getFamille: GetFamille = jest.fn((appelOffreId, familleId) =>
        okAsync(fakeFamille)
      )

      it('should not trigger ProjectGFDueDateSet', async () => {
        const projectGFDueDateSetListener = jest.fn()

        eventStore.subscribe(ProjectGFDueDateSet.type, (event) => {
          console.log('')
          projectGFDueDateSetListener(event)
        })

        handleProjectNotified(eventStore, { generateCertificate, getFamille })

        await eventStore.publish(
          new ProjectNotified({ payload: fakePayload, requestId: 'request1' })
        )

        await new Promise((resolve) => setTimeout(resolve, 1))

        expect(getFamille).toHaveBeenCalledWith(
          fakePayload.appelOffreId,
          fakePayload.familleId
        )

        expect(projectGFDueDateSetListener).not.toHaveBeenCalled()
      })
    })
  })

  describe('when generateCertificate succeeds', () => {
    const eventStore = new InMemoryEventStore()

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

    beforeAll((done) => {
      eventStore.subscribe(ProjectCertificateGenerated.type, (event) => {
        projectCertificateGeneratedEvent = event
        done()
      })

      handleProjectNotified(eventStore, { generateCertificate, getFamille })

      eventStore.publish(
        new ProjectNotified({ payload: fakePayload, requestId: 'request1' })
      )
    })

    it('should call generateCertificate with the projectId', () => {
      expect(generateCertificate).toHaveBeenCalledWith(fakePayload.projectId)
    })

    it('should trigger ProjectCertificateGenerated event', () => {
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
    })
  })

  describe('when generateCertificate fails twice then succeeds', () => {
    const eventStore = new InMemoryEventStore()

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

    const fakeProjectCertificateGenerationFailedHandler = jest.fn()

    let projectCertificateGeneratedEvent: StoredEvent | undefined = undefined
    let projectCertificateGeneratedEventCount = 0

    beforeAll((done) => {
      eventStore.subscribe(
        ProjectCertificateGenerationFailed.type,
        fakeProjectCertificateGenerationFailedHandler
      )

      eventStore.subscribe(ProjectCertificateGenerated.type, (event) => {
        projectCertificateGeneratedEvent = event
        projectCertificateGeneratedEventCount += 1
        done()
      })

      handleProjectNotified(eventStore, { generateCertificate, getFamille })

      eventStore.publish(new ProjectNotified({ payload: fakePayload }))
    })

    it('should retry calling generateCertificate with the projectId three times', () => {
      expect(generateCertificate).toHaveBeenCalledTimes(3)
    })

    it('should trigger ProjectCertificateGenerated event', () => {
      expect(projectCertificateGeneratedEventCount).toEqual(1)
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
    })

    it('should not trigger ProjectCertificateGenerationFailed event', () => {
      expect(
        fakeProjectCertificateGenerationFailedHandler
      ).not.toHaveBeenCalled()
    })
  })

  describe('when generateCertificate keeps failing', () => {
    const eventStore = new InMemoryEventStore()

    const generateCertificate = jest.fn((projectId: string) =>
      errAsync<string, DomainError>(new OtherError('test error'))
    )
    const getFamille = jest.fn()

    const fakeProjectCertificateGeneratedHandler = jest.fn()
    const fakePayload = {
      projectId: 'project1',
      candidateEmail: 'email',
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      familleId: 'famille1',
      notifiedOn: 0,
    }

    let projectCertificateGeneratedEvent: StoredEvent | undefined = undefined
    let projectCertificateGeneratedEventCount = 0

    beforeAll((done) => {
      eventStore.subscribe(
        ProjectCertificateGenerated.type,
        fakeProjectCertificateGeneratedHandler
      )
      eventStore.subscribe(ProjectCertificateGenerationFailed.type, (event) => {
        projectCertificateGeneratedEvent = event
        projectCertificateGeneratedEventCount += 1
        done()
      })

      handleProjectNotified(eventStore, { generateCertificate, getFamille })

      eventStore.publish(
        new ProjectNotified({ payload: fakePayload, requestId: 'request1' })
      )
    })

    it('should retry calling generateCertificate with the projectId three times', () => {
      expect(generateCertificate).toHaveBeenCalledTimes(3)
    })

    it('should trigger ProjectCertificateGenerationFailed event', () => {
      expect(projectCertificateGeneratedEventCount).toEqual(1)
      expect(projectCertificateGeneratedEvent).toBeDefined()
      if (!projectCertificateGeneratedEvent) return
      expect(projectCertificateGeneratedEvent.type).toEqual(
        ProjectCertificateGenerationFailed.type
      )
      expect((projectCertificateGeneratedEvent.payload as any).error).toEqual(
        'test error'
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
      expect(projectCertificateGeneratedEvent.requestId).toEqual('request1')
    })

    it('should not trigger ProjectCertificateGenerated event', () => {
      expect(fakeProjectCertificateGeneratedHandler).not.toHaveBeenCalled()
    })
  })
})
