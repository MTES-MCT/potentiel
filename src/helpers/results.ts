import { Result } from '@hqoss/monads'
import { logger } from '@core/utils'

const mapExceptError = <T, K>(arr: Array<T>, fn: (T) => K, errorMessage: string): Array<K> =>
  arr.reduce((validItems: Array<K>, item: T) => {
    try {
      validItems.push(fn(item))
    } catch (error) {
      if (errorMessage) logger.error(errorMessage)
      logger.error(error)
    }
    return validItems
  }, [])

const mapIfOk = <T, K>(
  arr: Array<T>,
  fn: (T) => Result<K, Error>,
  errorMessage: string
): Array<K> =>
  arr.reduce((validItems: Array<K>, item: T) => {
    const result = fn(item)
    if (result.isOk()) {
      validItems.push(result.unwrap())
    } else {
      if (errorMessage) logger.error(errorMessage)
      logger.error(result.unwrapErr())
      logger.info(item)
    }
    return validItems
  }, [])

export { mapExceptError, mapIfOk }
