import { Constructor, DomainEvent, HasType } from '../../core/domain'
import { ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../../modules/shared'

expect.extend({
  toHavePublished(
    eventBus: {
      publish: jest.Mock<ResultAsync<null, InfraNotAvailableError>, [event: DomainEvent]>
    },
    eventClass: Constructor<DomainEvent> & HasType
  ) {
    if (!eventBus.publish.mock.calls.length) {
      return {
        message: () => `expected eventBus to have published at least one event`,
        pass: false,
      }
    }

    const pass = eventBus.publish.mock.calls
      .map((call) => call[0])
      .some((event) => event.type === eventClass.type)

    return {
      message: pass
        ? () => `expected eventBus to have published at least one event of type ${eventClass.type}`
        : () => {
            const emittedEventTypes = eventBus.publish.mock.calls.map((call) => call[0].type)
            return `
Expected the eventBus to have published an event of type ${this.utils.printExpected(
              eventClass.type
            )}
Instead, the eventBus triggered ${this.utils.printReceived(emittedEventTypes.join(', '))}`
          },
      pass,
    }
  },
})
