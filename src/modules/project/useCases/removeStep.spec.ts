import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { EventBus } from '../../../modules/eventStore'
import { InfraNotAvailableError } from '../../../modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { ProjectDCRRemoved, ProjectGFRemoved, ProjectPTFRemoved } from '../events'
import { makeRemoveStep } from './removeStep'

const projectId = new UniqueEntityID().toString()

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('removeStep use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    describe('when type is ptf', () => {
      beforeAll(async () => {
        const shouldUserAccessProject = jest.fn(async () => true)
        fakePublish.mockClear()

        const removeStep = makeRemoveStep({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
        })

        const res = await removeStep({
          type: 'ptf',
          projectId,
          removedBy: user,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        })
      })

      it('should trigger a ProjectPTFRemoved event', async () => {
        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectPTFRemoved.type) as ProjectPTFRemoved

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId)
        expect(targetEvent.payload.removedBy).toEqual(user.id)
      })
    })

    describe('when type is dcr', () => {
      beforeAll(async () => {
        const shouldUserAccessProject = jest.fn(async () => true)
        fakePublish.mockClear()

        const removeStep = makeRemoveStep({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
        })

        const res = await removeStep({
          type: 'dcr',
          projectId,
          removedBy: user,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        })
      })

      it('should trigger a ProjectDCRRemoved event', async () => {
        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectDCRRemoved.type) as ProjectDCRRemoved

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId)
        expect(targetEvent.payload.removedBy).toEqual(user.id)
      })
    })

    describe('when type is garantie-financiere', () => {
      beforeAll(async () => {
        const shouldUserAccessProject = jest.fn(async () => true)
        fakePublish.mockClear()

        const removeStep = makeRemoveStep({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
        })

        const res = await removeStep({
          type: 'garantie-financiere',
          projectId,
          removedBy: user,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        })
      })

      it('should trigger a ProjectGFRemoved event', async () => {
        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectGFRemoved.type) as ProjectGFRemoved

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId)
        expect(targetEvent.payload.removedBy).toEqual(user.id)
      })
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const removeStep = makeRemoveStep({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
      })

      const res = await removeStep({
        type: 'ptf',
        projectId,
        removedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
