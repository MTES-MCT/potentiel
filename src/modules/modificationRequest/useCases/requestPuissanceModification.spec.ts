import { DomainEvent } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationReceived, ModificationRequested } from '../events'
import { makeRequestPuissanceModification } from './requestPuissanceModification'

describe('requestPuissanceModification use-case', () => {
  const shouldUserAccessProject = jest.fn(async () => true)
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = { ...makeFakeProject(), puissanceInitiale: 100 }
  const projectRepo = fakeTransactionalRepo(fakeProject as Project)
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }

  describe('when user is not allowed', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
      })

      const res = await requestPuissanceModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newPuissance: 105,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when new puissance is < 90% of puissanceInitiale', () => {
    beforeAll(async () => {
      fakePublish.mockClear()

      const newPuissance = 89

      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
      })

      const res = await requestPuissanceModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newPuissance,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user: fakeUser,
        projectId: fakeProject.id.toString(),
      })
    })

    it('should emit a ModificationRequested', () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const event = eventBus.publish.mock.calls[0][0]
      expect(event).toBeInstanceOf(ModificationRequested)
    })

    it('should not change the project', () => {
      expect(fakeProject.pendingEvents).toHaveLength(0)
    })
  })

  describe('when new puissance is > 110% of puissanceInitiale', () => {
    beforeAll(async () => {
      fakePublish.mockClear()

      const newPuissance = 111

      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
      })

      const res = await requestPuissanceModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newPuissance,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user: fakeUser,
        projectId: fakeProject.id.toString(),
      })
    })

    it('should emit a ModificationRequested', () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const event = eventBus.publish.mock.calls[0][0]
      expect(event).toBeInstanceOf(ModificationRequested)
    })

    it('should not change the project', () => {
      expect(fakeProject.pendingEvents).toHaveLength(0)
    })
  })

  describe('when new puissance is between 90% and 110% of puissanceInitiale', () => {
    beforeAll(async () => {
      fakePublish.mockClear()

      const newPuissance = 105

      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
      })

      const res = await requestPuissanceModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newPuissance,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user: fakeUser,
        projectId: fakeProject.id.toString(),
      })
    })

    it('should emit a ModificationSubmitted', async () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const event = eventBus.publish.mock.calls[0][0]
      expect(event).toBeInstanceOf(ModificationReceived)
    })

    it('should update the puissance', () => {
      expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, 105)
    })
  })
})
