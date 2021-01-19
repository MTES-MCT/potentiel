import { logger } from '../core/utils'
import { isProdEnv } from './env.config'
import * as Sentry from '@sentry/node'

if (isProdEnv) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })

  logger.on('info', (...args) => {
    console.info(...args)
  })

  logger.on('warning', (message: string) => {
    console.warn(message)
    Sentry.captureMessage(message)
  })

  logger.on('error', (exception: Error) => {
    console.error(exception)
    Sentry.captureException(exception)
  })
} else {
  logger.on('debug', (...args) => {
    console.debug(...args)
  })

  logger.on('info', (...args) => {
    console.info(...args)
  })

  logger.on('warning', (message: string) => {
    console.warn(message)
  })

  logger.on('error', (exception: Error) => {
    console.error(exception)
  })
}
