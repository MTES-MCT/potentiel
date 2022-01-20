import { UserProjectsLinkedByContactEmail } from '..'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
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

    expect(eventBus).toHavePublishedTimes(1)
    expect(eventBus).toHavePublishedWithPayload(UserProjectsLinkedByContactEmail, {
      userId: 'userId',
      projectIds: [projectWithSameEmailId],
    })
  })
})
