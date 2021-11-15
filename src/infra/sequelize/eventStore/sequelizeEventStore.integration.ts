import { v4 as uuid } from 'uuid'
import { DomainEvent } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { ProjectGFRemoved, ProjectNotified } from '../../../modules/project/events'
import { OtherError } from '../../../modules/shared'
import { resetDatabase } from '../helpers'
import models from '../models'
import { SequelizeEventStore } from './sequelizeEventStore'

describe('SequelizeEventStore', () => {
  const sampleProjectGFRemovedPayload = {
    projectId: uuid(),
    removedBy: '1',
  }

  const sampleProjectNotifiedPayload = {
    periodeId: 'A',
    appelOffreId: 'B',
    projectId: 'projectNotified',
    familleId: 'F',
    candidateEmail: '',
    candidateName: '',
    notifiedOn: 0,
  }

  describe('subscribe', () => {
    beforeAll(async () => {
      await resetDatabase()
    })

    it('should listen to events of a specific type', (done) => {
      const eventStore = new SequelizeEventStore(models)

      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        expect(event.type).toEqual(ProjectGFRemoved.type)
        done()
      })

      eventStore.publish(
        new ProjectNotified({
          payload: sampleProjectNotifiedPayload,
        })
      )

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
        })
      )
    })

    it('should receive events in the order they were published', (done) => {
      const eventStore = new SequelizeEventStore(models)

      const requestId1 = uuid()
      const requestId2 = uuid()

      const receivedEventsIds: string[] = []
      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        receivedEventsIds.push(event.requestId || '')
        if (receivedEventsIds.length === 2) {
          expect(receivedEventsIds).toEqual([requestId1, requestId2])
          done()
        }
      })

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
          requestId: requestId1,
        })
      )

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
          requestId: requestId2,
        })
      )
    })

    it('should accept multiple subscribers for the same event type', (done) => {
      const eventStore = new SequelizeEventStore(models)

      const subscriberCatches: string[] = []
      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        subscriberCatches.push('A')
      })

      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        subscriberCatches.push('B')
        if (subscriberCatches.length === 2) {
          expect(subscriberCatches).toEqual(['A', 'B'])
          done()
        }
      })

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
        })
      )
    })
  })

  describe('publish', () => {
    const eventStore = new SequelizeEventStore(models)

    const requestId = uuid()

    const event = new ProjectGFRemoved({
      payload: sampleProjectGFRemovedPayload,
      requestId: requestId,
    })
    let caughtEvent: DomainEvent | undefined

    beforeAll(async () => {
      await resetDatabase()

      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        caughtEvent = event
      })

      const result = await eventStore.publish(event)
      expect(result.isOk()).toBe(true)
    })

    it('should publish an event of a specific type', () => {
      expect(caughtEvent).toBeDefined()
      if (caughtEvent) {
        expect(caughtEvent.type).toEqual(ProjectGFRemoved.type)
        expect(caughtEvent.payload).toEqual(sampleProjectGFRemovedPayload)
      }
    })

    it('should perist the event', async () => {
      const EventModel = models.EventStore
      const allEvents = await EventModel.findAll()
      expect(allEvents).toHaveLength(1)
      const persistedEvent = allEvents[0]
      expect(persistedEvent.type).toEqual(ProjectGFRemoved.type)
      expect(persistedEvent.payload).toEqual(sampleProjectGFRemovedPayload)
      expect(persistedEvent.requestId).toEqual(requestId)
      expect(persistedEvent.aggregateId).toEqual([sampleProjectGFRemovedPayload.projectId])
      expect(persistedEvent.occurredAt).toEqual(event.occurredAt)
      expect(persistedEvent.version).toEqual(event.getVersion().toString())
    })
  })

  describe('transaction', () => {
    describe('when the transaction function throws', () => {
      beforeAll(async () => {
        await resetDatabase()
      })

      it('should return a Error Result of type OtherError', async () => {
        const eventStore = new SequelizeEventStore(models)

        const result = await eventStore.transaction(async () => {
          throw new Error('OOPS')
        })

        expect(result.isErr()).toBe(true)
        if (result.isOk()) return
        expect(result.error instanceof OtherError).toBe(true)
        expect(result.error.message).toBe('OOPS')
      })
    })

    describe('ordering', () => {
      beforeAll(async () => {
        await resetDatabase()
      })

      it('should be executed entirely before any other transaction is started', async () => {
        const eventStore = new SequelizeEventStore(models)

        eventStore.subscribe(ProjectGFRemoved.type, () => {})

        let transactionADone = false

        const result = eventStore.transaction(async () => {
          // wait for something
          await new Promise((resolve) => {
            setTimeout(resolve, 500)
          })

          transactionADone = true
        })

        eventStore.transaction(async () => {
          expect(transactionADone).toBe(true)
        })

        expect((await result).isOk()).toBe(true)
      })

      it('should be executed entirely before any publish is executed', (done) => {
        const eventStore = new SequelizeEventStore(models)

        let transactionADone = false

        eventStore.subscribe(ProjectGFRemoved.type, () => {
          expect(transactionADone).toBe(true)
          done()
        })

        eventStore.transaction(async () => {
          // wait for something
          await new Promise((resolve) => {
            setTimeout(resolve, 500)
          })

          transactionADone = true
        })

        eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
          })
        )
      })

      it('should have its published events before other publish commands', async () => {
        await resetDatabase()

        const requestId1 = uuid()
        const requestId2 = uuid()

        const eventStore = new SequelizeEventStore(models)

        let firstRequest: string | undefined
        eventStore.subscribe(ProjectGFRemoved.type, (event) => {
          if (!firstRequest) firstRequest = event.requestId
          expect(firstRequest).toEqual(requestId1)
        })

        eventStore.transaction(async ({ publish }) => {
          // wait for something
          await new Promise((resolve) => {
            setTimeout(resolve, 500)
          })
          await publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: requestId1,
            })
          )
        })
        eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
            requestId: requestId2,
          })
        )
      })

      it('should emit all inner published events after the transaction is done', (done) => {
        const eventStore = new SequelizeEventStore(models)

        const chronology: string[] = []
        const requestId1 = uuid()
        const requestId2 = uuid()

        let eventCount = 0
        eventStore.subscribe(ProjectGFRemoved.type, (event) => {
          chronology.push(event.requestId || '')
          if (++eventCount === 2) {
            expect(chronology).toEqual(['transactionDone', requestId1, requestId2])
            done()
          }
        })

        eventStore.transaction(async ({ publish }) => {
          publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: requestId1,
            })
          )

          publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: requestId2,
            })
          )

          // wait for something
          await new Promise((resolve) => {
            setTimeout(resolve, 500)
          })

          chronology.push('transactionDone')
        })
      })
    })

    describe('publish', () => {
      const requestId = uuid()

      const event = new ProjectGFRemoved({
        payload: sampleProjectGFRemovedPayload,
        requestId,
      })

      beforeAll(async () => {
        await resetDatabase()

        const eventStore = new SequelizeEventStore(models)

        const result = await eventStore.transaction(async ({ publish }) => {
          publish(event)
        })

        expect(result.isOk()).toBe(true)
      })

      it('should persist the event', async () => {
        const EventModel = models.EventStore
        const allEvents = await EventModel.findAll()
        expect(allEvents).toHaveLength(1)
        const persistedEvent = allEvents[0]
        expect(persistedEvent.type).toEqual(ProjectGFRemoved.type)
        expect(persistedEvent.payload).toEqual(sampleProjectGFRemovedPayload)
        expect(persistedEvent.requestId).toEqual(requestId)
        expect(persistedEvent.aggregateId).toEqual([sampleProjectGFRemovedPayload.projectId])
        expect(persistedEvent.occurredAt).toEqual(event.occurredAt)
        expect(persistedEvent.version).toEqual(event.getVersion().toString())
      })
    })

    describe('loadHistory', () => {
      it('should access history from before the transaction start', async () => {
        const eventStore = new SequelizeEventStore(models)
        await resetDatabase()

        const EventModel = models.EventStore

        await EventModel.create({
          id: uuid(),
          type: 'ProjectNotified',
          version: '1',
          payload: {},
          occurredAt: new Date(),
          requestId: uuid(),
          aggregateId: ['aggregate1'],
        })

        const result = await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory('aggregate1')
        })

        expect(result.isOk()).toBe(true)
      })

      it('should filter history by specific aggregateId', async () => {
        const eventStore = new SequelizeEventStore(models)
        await resetDatabase()

        const requestId1 = uuid()
        const requestId2 = uuid()

        const projectId = uuid()

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId },
            requestId: requestId1,
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId },
            requestId: requestId2,
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: uuid() },
            requestId: uuid(),
          })
        )

        let priorEvents: DomainEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory(projectId).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })

        expect(priorEvents).toHaveLength(2)
        expect(
          priorEvents.every(
            (event) => !!event.requestId && [requestId1, requestId2].includes(event.requestId)
          )
        ).toEqual(true)
      })
    })
  })
})
