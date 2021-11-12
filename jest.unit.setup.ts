import { DomainEvent } from './src/core/domain'
import { ResultAsync } from './src/core/utils'
import { InfraNotAvailableError } from './src/modules/shared'

expect.extend({
  toHavePublished(
    eventBus: {
      publish: jest.Mock<ResultAsync<null, InfraNotAvailableError>, [event: DomainEvent]>
    },
    eventType: DomainEvent['type']
  ) {
    const pass = eventBus.publish.mock.calls
      .map((call) => call[0])
      .some((event) => event.type === eventType)

    return {
      message: () => `expected eventBus to have published at least one event of type ${eventType}`,
      pass,
    }
  },
})
