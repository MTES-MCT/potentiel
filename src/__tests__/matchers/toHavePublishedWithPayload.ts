import { DomainEvent, Constructor, HasType } from '../../core/domain'
import { ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '@modules/shared'
import _ from 'lodash'
import { diffLinesUnified2 } from 'jest-diff'
import { format } from 'pretty-format'

expect.extend({
  toHavePublishedWithPayload(
    eventBus: {
      publish: jest.Mock<ResultAsync<null, InfraNotAvailableError>, [event: DomainEvent]>
    },
    eventClass: Constructor<DomainEvent> & HasType,
    expectedPayload: any
  ) {
    const eventsOfClass = eventBus.publish.mock.calls
      .map((call) => call[0])
      .filter((event) => event.type === eventClass.type)

    if (!eventsOfClass.length) {
      return {
        message: () => {
          const emittedEventTypes = eventBus.publish.mock.calls.map((call) => call[0].type)
          return `
Expected the eventBus to have published an event of type ${this.utils.printExpected(
            eventClass.type
          )}
Instead, the eventBus triggered ${this.utils.printReceived(emittedEventTypes.join(', '))}`
        },
        pass: false,
      }
    }

    const pass = eventsOfClass.some((event) => _.isMatch(event.payload, expectedPayload))

    const message = pass
      ? () =>
          `expected eventBus to have published at least one event of type ${eventClass.type} that matches the payload`
      : () => {
          const receivedPayload = eventsOfClass[0].payload
          const difference = diffLinesUnified2(
            // serialize with indentation to display lines
            format(receivedPayload).split('\n'),
            format(expectedPayload).split('\n'),
            // serialize without indentation to compare lines
            format(receivedPayload, { indent: 0 }).split('\n'),
            format(expectedPayload, { indent: 0 }).split('\n')
          )
          return (
            this.utils.matcherHint('toHavePublishedWithPayload', undefined, undefined) +
            '\n\n' +
            difference
          )
        }

    return {
      message,
      pass,
    }
  },
})
