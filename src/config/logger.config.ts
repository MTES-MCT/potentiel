import { logger } from '@core/utils'
import { isProdEnv } from './env.config'
import * as Sentry from '@sentry/node'

if (isProdEnv) {
  const sentryDsn = process.env.SENTRY_DSN

  if (!sentryDsn) {
    console.error('SENTRY_DSN is empty. It should be provided as an environment variable.')
    process.exit(1)
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })

  logger.on('infoLog', (...args) => {
    console.info(...args)
  })

  logger.on('warningLog', (message: string) => {
    console.warn(message)
    Sentry.captureMessage(message)
  })

  logger.on('errorLog', (exception: Error | string) => {
    console.error(exception)
    Sentry.captureException(exception)
  })
} else {
  logger.on('debugLog', (...args) => {
    console.debug(...args)
  })

  logger.on('infoLog', (...args) => {
    console.info(...args)
  })

  logger.on('warningLog', (message: string) => {
    console.warn(message)
  })

  logger.on('errorLog', (exception: Error | string) => {
    console.error(exception)
  })
}
