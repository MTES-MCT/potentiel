import { merge } from 'lodash'

import { BaseDomainEvent, DomainEvent, EventBus } from '@core/domain'
import { logger } from '@core/utils'
import { isObject } from '../../../helpers/isObject'

interface HasType {
  type: string
}

interface Constructor<T> {
  new (args: any): T
}

interface Handler<Event> {
  (event: Event): any
}

export const makeProjector = () => {
  const handlers: any[] = []
  let eventBus: EventBus
  let model: any

  function subscribe<Event extends DomainEvent>(eventType: string, handler: Handler<Event>) {
    if (eventBus) {
      eventBus.subscribe(eventType, handler)
    } else {
      handlers.push({
        eventType,
        handler,
      })
    }

    // Returning handler allows projection handlers to export the result of the subscription
    return handler
  }

  const on = <Payload, Event extends BaseDomainEvent<Payload>>(
    eventClass: Constructor<Event> & HasType
  ) => ({
    create(cb: Handler<Event>) {
      const eventHandler = async (event) => {
        try {
          await model.create(cb(event))
        } catch (e) {
          logger.error(e)
        }
      }
      return subscribe(eventClass.type, eventHandler) as Handler<Event>
    },
    update(args: { where: Handler<Event>; delta: Handler<Event> }) {
      const { where, delta } = args
      const eventHandler = async (event) => {
        try {
          const instance = await model.findOne({ where: where(event) })

          if (instance === null) {
            logger.error(
              `${model?.name}.on${eventClass.type} failed to find item to update (where: ${where(
                event
              )})`
            )
            return
          }

          for (const [key, value] of Object.entries(delta(event))) {
            instance.set(key, isObject(value) ? merge({}, instance.get(key) || {}, value) : value)
          }

          await instance.save()
        } catch (e) {
          logger.error(e)
        }
      }
      return subscribe(eventClass.type, eventHandler) as Handler<Event>
    },
    delete(where: Handler<Event>) {
      const eventHandler = async (event) => {
        try {
          await model.destroy({ where: where(event) })
        } catch (e) {
          logger.error(e)
        }
      }
      return subscribe(eventClass.type, eventHandler) as Handler<Event>
    },
  })

  const initModel = (_model: any) => {
    model = _model
  }

  const initEventBus = (_eventBus: EventBus) => {
    eventBus = _eventBus
    handlers.forEach(({ eventType, handler }) => {
      eventBus.subscribe(eventType, handler)
    })
  }

  return {
    on,
    initModel,
    initEventBus,
  }
}
