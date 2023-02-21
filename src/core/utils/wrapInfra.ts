import { InfraNotAvailableError } from '@modules/shared'
import { ResultAsync } from './Result'
import { logger } from './logger'

/**
 * Wrap an infrastructure promise (db query, api call, ...) in a ResultAsync
 * @param infraPromise promise to be wrapped
 */
export const wrapInfra = <T>(infraPromise: Promise<T>): ResultAsync<T, InfraNotAvailableError> =>
  ResultAsync.fromPromise(infraPromise, (e: any) => {
    logger.error(e)
    return new InfraNotAvailableError()
  })
