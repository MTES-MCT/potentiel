import { EventEmitter } from 'events'
const emitter = new EventEmitter()

export const logger = Object.freeze({
  debug(...args: any) {
    emitter.emit('debug', ...args)
  },
  info(...args: any) {
    emitter.emit('info', ...args)
  },
  warning(message: string) {
    emitter.emit('warning', message)
  },
  error(error: Error) {
    emitter.emit('error', error)
  },
  on: emitter.on,
})
