import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeUpdateNewRulesOptIn } from './updateNewRulesOptIn'
import { ProjectNewRulesOptedIn } from '..'

describe('ProjectSteps.updateNewRulesOptIn()', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const projectId = new UniqueEntityID().toString()

  const fakeEventBus: EventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }

  describe('When user is not authorized to access the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
      })

      const res = await updateNewRulesOptIn({
        projectId,
        optedInBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('When user is authorized', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
      eventBus: fakeEventBus,
      shouldUserAccessProject,
    })

    it('should emit ProjectNewRulesOptedIn', async () => {
      fakePublish.mockClear()

      const res = await updateNewRulesOptIn({
        projectId,
        optedInBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })

      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectNewRulesOptedIn.type) as ProjectNewRulesOptedIn

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId)
    })
  })
})
