import { okAsync } from '../../../core/utils'
import { StoredEvent } from '../../../modules/eventStore'
import {
  ProjectCertificateGenerated,
  ProjectGFRemoved,
  ProjectNotified,
} from '../../../modules/project/events'
import { OtherError } from '../../../modules/shared'
import { sequelize } from '../../../sequelize.config'
import models from '../models'
import { SequelizeEventStore } from './sequelizeEventStore'

describe('SequelizeEventStore', () => {
  const sampleProjectGFRemovedPayload = {
    projectId: 'projectWithGFRemoved',
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
      // Create the tables and remove all data
      await sequelize.sync({ force: true })
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

      const receivedEventsIds: string[] = []
      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        receivedEventsIds.push(event.requestId || '')
        if (receivedEventsIds.length === 2) {
          expect(receivedEventsIds).toEqual(['1', '2'])
          done()
        }
      })

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
          requestId: '1',
        })
      )

      eventStore.publish(
        new ProjectGFRemoved({
          payload: sampleProjectGFRemovedPayload,
          requestId: '2',
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

    const event = new ProjectGFRemoved({
      payload: sampleProjectGFRemovedPayload,
      requestId: 'A',
    })
    let caughtEvent: StoredEvent | undefined

    beforeAll(async (done) => {
      await sequelize.sync({ force: true })

      eventStore.subscribe(ProjectGFRemoved.type, (event) => {
        caughtEvent = event
        done()
      })

      const result = await eventStore.publish(event)
      expect(result.isOk()).toBe(true)
    })

    it('should publish an event of a specific type', () => {
      expect(caughtEvent).toBeDefined()
      if (!caughtEvent) return
      expect(caughtEvent.type).toEqual(ProjectGFRemoved.type)
      expect(caughtEvent.payload).toEqual(sampleProjectGFRemovedPayload)
    })

    it('should perist the event', async () => {
      const EventModel = models.EventStore
      const allEvents = await EventModel.findAll()
      expect(allEvents).toHaveLength(1)
      const persistedEvent = allEvents[0]
      expect(persistedEvent.type).toEqual(ProjectGFRemoved.type)
      expect(persistedEvent.payload).toEqual(sampleProjectGFRemovedPayload)
      expect(persistedEvent.requestId).toEqual('A')
      expect(persistedEvent.aggregateId).toEqual(sampleProjectGFRemovedPayload.projectId)
      expect(persistedEvent.occurredAt).toEqual(event.occurredAt)
      expect(persistedEvent.version).toEqual(event.getVersion().toString())
    })
  })

  describe('transaction', () => {
    describe('when the transaction function throws', () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await sequelize.sync({ force: true })
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
        // Create the tables and remove all data
        await sequelize.sync({ force: true })
      })

      it('should be executed entirely before any other transaction is started', async (done) => {
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
          done()
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

      it('should have its published events before other publish commands', async (done) => {
        await sequelize.sync({ force: true })

        const eventStore = new SequelizeEventStore(models)

        let firstRequest: string | undefined
        eventStore.subscribe(ProjectGFRemoved.type, (event) => {
          if (!firstRequest) firstRequest = event.requestId
          expect(firstRequest).toEqual('A')
          done()
        })

        eventStore.transaction(async ({ publish }) => {
          // wait for something
          await new Promise((resolve) => {
            setTimeout(resolve, 500)
          })
          await publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: 'A',
            })
          )
        })
        eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
            requestId: 'B',
          })
        )
      })

      it('should emit all inner published events after the transaction is done', (done) => {
        const eventStore = new SequelizeEventStore(models)

        const chronology: string[] = []

        let eventCount = 0
        eventStore.subscribe(ProjectGFRemoved.type, (event) => {
          chronology.push(event.requestId || '')
          if (++eventCount === 2) {
            expect(chronology).toEqual(['transactionDone', 'A', 'B'])
            done()
          }
        })

        eventStore.transaction(async ({ publish }) => {
          publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: 'A',
            })
          )

          publish(
            new ProjectGFRemoved({
              payload: sampleProjectGFRemovedPayload,
              requestId: 'B',
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
      const event = new ProjectGFRemoved({
        payload: sampleProjectGFRemovedPayload,
        requestId: 'A',
      })
      beforeAll(async () => {
        // Create the tables and remove all data
        await sequelize.sync({ force: true })

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
        expect(persistedEvent.requestId).toEqual('A')
        expect(persistedEvent.aggregateId).toEqual(sampleProjectGFRemovedPayload.projectId)
        expect(persistedEvent.occurredAt).toEqual(event.occurredAt)
        expect(persistedEvent.version).toEqual(event.getVersion().toString())
      })
    })

    describe('loadHistory', () => {
      it('should access history from before the transaction start', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        const EventModel = models.EventStore

        await EventModel.create({
          id: '',
          type: 'ProjectNotified',
          version: '1',
          payload: {},
          occurredAt: new Date(),
          requestId: 'request1',
          aggregateId: 'aggregate1',
        })

        const result = await eventStore.transaction(async ({ loadHistory }) => {
          const events = await loadHistory()
          console.log('events', events)
        })

        expect(result.isOk()).toBe(true)
      })

      it('should filter history by specific eventType', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
          })
        )

        await eventStore.publish(
          new ProjectNotified({
            payload: sampleProjectNotifiedPayload,
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({ eventType: ProjectGFRemoved.type }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })

        expect(priorEvents).toHaveLength(1)
        expect(priorEvents[0].type).toEqual(ProjectGFRemoved.type)
      })

      it('should filter history by multiple eventTypes', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
          })
        )

        await eventStore.publish(
          new ProjectNotified({
            payload: sampleProjectNotifiedPayload,
          })
        )

        await eventStore.publish(
          new ProjectCertificateGenerated({
            payload: {
              periodeId: 'A',
              appelOffreId: 'B',
              projectId: '',
              candidateEmail: '',
              certificateFileId: '',
              projectVersionDate: new Date(0),
            },
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({
            eventType: [ProjectGFRemoved.type, ProjectNotified.type],
          }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })

        expect(priorEvents).toHaveLength(2)
        expect(
          priorEvents.every((event: any) =>
            [ProjectGFRemoved.type, ProjectNotified.type].includes(event.type)
          )
        ).toBe(true)
      })

      it('should filter history by specific requestId', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
            requestId: '1',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: sampleProjectGFRemovedPayload,
            requestId: '2',
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({ requestId: '1' }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })
        expect(priorEvents).toHaveLength(1)
        expect(priorEvents[0].requestId).toEqual('1')
      })

      it('should filter history by specific aggregateId', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '1' },
            requestId: 'A',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '1' },
            requestId: 'B',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '2' },
            requestId: 'C',
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({ aggregateId: '1' }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })
        expect(priorEvents).toHaveLength(2)
        expect(
          priorEvents.every((event) => !!event.requestId && ['A', 'B'].includes(event.requestId))
        ).toEqual(true)
      })

      it('should filter history by multiple aggregateId', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '1' },
            requestId: 'A',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '1' },
            requestId: 'B',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '2' },
            requestId: 'C',
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, projectId: '3' },
            requestId: 'D',
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({ aggregateId: ['1', '2'] }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })
        expect(priorEvents).toHaveLength(3)
        expect(
          priorEvents.every(
            (event) => !!event.requestId && ['A', 'B', 'C'].includes(event.requestId)
          )
        ).toEqual(true)
      })

      it('should filter history by payload filter', async () => {
        const eventStore = new SequelizeEventStore(models)
        await sequelize.sync({ force: true })

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, removedBy: 'A' },
          })
        )

        await eventStore.publish(
          new ProjectGFRemoved({
            payload: { ...sampleProjectGFRemovedPayload, removedBy: 'B' },
          })
        )

        let priorEvents: StoredEvent[] = []

        await eventStore.transaction(async ({ loadHistory }) => {
          await loadHistory({ payload: { removedBy: 'A' } }).andThen((_priorEvents) => {
            priorEvents = _priorEvents
            return okAsync(null)
          })
        })
        expect(priorEvents).toHaveLength(1)
        expect((priorEvents[0] as any).payload.removedBy).toEqual('A')
      })
    })
  })
})
