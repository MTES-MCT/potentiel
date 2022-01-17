import { DomainEvent, Constructor, HasType } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

expect.extend({
  toHavePublishedTimes(
    eventBus: {
      publish: jest.Mock<ResultAsync<null, InfraNotAvailableError>, [event: DomainEvent]>
    },
    times: number
  ) {
    const pass = eventBus.publish.mock.calls.length === times

    return {
      message: () => `expected eventBus to have published ${times} events`,
      pass,
    }
  },
})
