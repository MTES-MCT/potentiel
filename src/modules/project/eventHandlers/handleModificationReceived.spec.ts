import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { ModificationReceived } from '../../modificationRequest/events'
import { handleModificationReceived } from '.'
import { ProjectGFDueDateSet, ProjectGFInvalidated } from '..'

describe('handleModificationReceived', () => {
  const projectId = new UniqueEntityID()
  const modificationRequestId = new UniqueEntityID()
  const requestId = new UniqueEntityID().toString()

  const eventBus = {
    publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
    subscribe: jest.fn(),
  }

  const date = new Date('2021-01-01')
  const oneMonthLaterTimestamp = new Date('2021-02-01').getTime()

  describe('when type is not actionnaire nor producteur', () => {
    eventBus.publish.mockClear()

    const fakePayload = {
      modificationRequestId: modificationRequestId.toString(),
      type: 'puissance',
      projectId: projectId.toString(),
      requestedBy: 'user1',
      actionnaire: 'actionnaire1',
    }

    beforeAll(async () => {
      await handleModificationReceived({
        eventBus,
      })(
        new ModificationReceived({
          payload: fakePayload,
          requestId,
          original: {
            occurredAt: date,
            version: 1,
          },
        })
      )
    })

    it('should ignore the event', () => {
      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })

  describe('when type is actionnaire', () => {
    eventBus.publish.mockClear()

    const fakePayload = {
      modificationRequestId: modificationRequestId.toString(),
      type: 'actionnaire',
      projectId: projectId.toString(),
      requestedBy: 'user1',
      actionnaire: 'actionnaire1',
    }

    beforeAll(async () => {
      await handleModificationReceived({
        eventBus,
      })(
        new ModificationReceived({
          payload: fakePayload,
          requestId,
          original: {
            occurredAt: date,
            version: 1,
          },
        })
      )
    })

    it('should emit a ProjectGFDueDateSet event', () => {
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .filter((event): event is ProjectGFDueDateSet => event.type === ProjectGFDueDateSet.type)
        .pop()

      expect(event).toBeDefined()
      if (!event) return
      expect(event.payload.projectId).toEqual(projectId.toString())
      expect(event.payload.garantiesFinancieresDueOn).toEqual(oneMonthLaterTimestamp)
      expect(event.requestId).toEqual(requestId)
    })

    it('should emit a ProjectGFInvalidated event', () => {
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .filter((event): event is ProjectGFInvalidated => event.type === ProjectGFInvalidated.type)
        .pop()

      expect(event).toBeDefined()
      if (!event) return
      expect(event.payload.projectId).toEqual(projectId.toString())
      expect(event.requestId).toEqual(requestId)
    })
  })

  describe('when type is producteur', () => {
    eventBus.publish.mockClear()

    const fakePayload = {
      modificationRequestId: modificationRequestId.toString(),
      type: 'producteur',
      projectId: projectId.toString(),
      requestedBy: 'user1',
      producteur: 'producteur1',
    }

    beforeAll(async () => {
      await handleModificationReceived({
        eventBus,
      })(
        new ModificationReceived({
          payload: fakePayload,
          requestId,
          original: {
            occurredAt: date,
            version: 1,
          },
        })
      )
    })

    it('should emit a ProjectGFDueDateSet event', () => {
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .filter((event): event is ProjectGFDueDateSet => event.type === ProjectGFDueDateSet.type)
        .pop()

      expect(event).toBeDefined()
      if (!event) return
      expect(event.payload.projectId).toEqual(projectId.toString())
      expect(event.payload.garantiesFinancieresDueOn).toEqual(oneMonthLaterTimestamp)
      expect(event.requestId).toEqual(requestId)
    })

    it('should emit a ProjectGFInvalidated event', () => {
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .filter((event): event is ProjectGFInvalidated => event.type === ProjectGFInvalidated.type)
        .pop()

      expect(event).toBeDefined()
      if (!event) return
      expect(event.payload.projectId).toEqual(projectId.toString())
      expect(event.requestId).toEqual(requestId)
    })
  })
})
