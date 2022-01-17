import { DomainEvent, EventBus, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ProjectStepStatusUpdated } from '../events'
import { makeUpdateStepStatus } from './updateStepStatus'

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
const projectId = new UniqueEntityID().toString()
const projectStepId = new UniqueEntityID().toString()

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('ProjectSteps.updateStepStatus()', () => {
  describe('When user is not DREAL', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
      const shouldUserAccessProject = jest.fn(async () => false)

      const updateStepStatus = makeUpdateStepStatus({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
      })

      const res = await updateStepStatus({
        newStatus: 'validé',
        projectId,
        projectStepId,
        updatedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('When user is DREAL', () => {
    it('should emit ProjectStepStatusUpdated', async () => {
      fakePublish.mockClear()
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => true)

      const updateStepStatus = makeUpdateStepStatus({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
      })

      const res = await updateStepStatus({
        newStatus: 'validé',
        projectId,
        projectStepId,
        updatedBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })

      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectStepStatusUpdated.type) as ProjectStepStatusUpdated

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectStepId).toEqual(projectStepId)
      expect(targetEvent.payload.statusUpdatedBy).toEqual(user.id)
      expect(targetEvent.payload.newStatus).toEqual('validé')
    })
  })
})
