import { DomainEvent, Constructor, HasType } from '../../core/domain'
import { ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../../modules/shared'

expect.extend({
  toHavePublished(
    eventBus: {
      publish: jest.Mock<ResultAsync<null, InfraNotAvailableError>, [event: DomainEvent]>
    },
    eventClass: Constructor<DomainEvent> & HasType
  ) {
    const pass = eventBus.publish.mock.calls
      .map((call) => call[0])
      .some((event) => event.type === eventClass.type)

    return {
      message: () =>
        `expected eventBus to have published at least one event of type ${eventClass.type}`,
      pass,
    }
  },
})
