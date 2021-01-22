import { EventEmitter } from 'events'
const emitter = new EventEmitter()

export const logger = Object.freeze({
  debug(...args: any) {
    emitter.emit('debugLog', ...args)
  },
  info(...args: any) {
    emitter.emit('infoLog', ...args)
  },
  warning(message: string) {
    emitter.emit('warningLog', message)
  },
  error(error: Error | string) {
    emitter.emit('errorLog', error)
  },
  on: emitter.on.bind(emitter),
})
