import { UserProjectsLinkedByContactEmail } from '..'
import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { UserCreated } from '../../users'
import { handleUserCreated } from './handleUserCreated'

describe('authN.handleUserCreated', () => {
  it('should give rights to all existing projects with this email', async () => {
    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const projectWithSameEmailId = new UniqueEntityID().toString()
    const getNonLegacyProjectsByContactEmail = jest.fn((email: string) =>
      okAsync<string[], InfraNotAvailableError>([projectWithSameEmailId])
    )

    await handleUserCreated({
      eventBus,
      getNonLegacyProjectsByContactEmail,
    })(
      new UserCreated({
        payload: {
          userId: 'userId',
          email: 'test@test.test',
          role: 'porteur-projet',
          fullName: 'fullName',
        },
      })
    )

    const userProjectLinkedEvents = eventBus.publish.mock.calls
      .filter((call) => call[0].type === 'UserProjectsLinkedByContactEmail')
      .map((call) => call[0] as UserProjectsLinkedByContactEmail)

    expect(userProjectLinkedEvents).toHaveLength(1)
    expect(userProjectLinkedEvents[0].payload).toMatchObject({
      userId: 'userId',
      projectIds: [projectWithSameEmailId],
    })
  })
})
