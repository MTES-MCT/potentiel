import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
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
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))

  const shouldUserAccessProject = jest.fn(async () => true)

  beforeAll(async () => {
    fakePublish.mockClear()

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
  })

  it('should emit ProjectStepStatusUpdated', () => {
    expect(fakePublish).toHaveBeenCalled()
    const targetEvent = fakePublish.mock.calls
      .map((call) => call[0])
      .find((event) => event.type === ProjectStepStatusUpdated.type) as ProjectStepStatusUpdated

    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.projectStepId).toEqual(projectStepId)
    expect(targetEvent.payload.updatedBy).toEqual(user.id)
    expect(targetEvent.payload.newStatus).toEqual('validé')
  })
})
