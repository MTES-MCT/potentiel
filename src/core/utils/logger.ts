import { EventEmitter } from 'events'
const emitter = new EventEmitter()

export const logger = Object.freeze({
  debug(...args: any) {
    emitter.emit('debugLog', ...args)
  },
  info(...args: any) {
    emitter.emit('infoLog', ...args)
  },
  warning(message: string, context?: Record<string, unknown>) {
    emitter.emit('warningLog', message, context)
  },
  error(error: Error | string) {
    emitter.emit('errorLog', error)
  },
  on: emitter.on.bind(emitter),
})
