import { Result } from '@usefultools/monads'

const mapExceptError = <T, K>(arr: Array<T>, fn: (T) => K, errorMessage: string): Array<K> =>
  arr.reduce((validItems: Array<K>, item: T) => {
    try {
      validItems.push(fn(item))
    } catch (error) {
      console.log(errorMessage || 'mapExceptError error', error)
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
    if (result.is_ok()) {
      validItems.push(result.unwrap())
    } else {
      console.log(errorMessage || 'mapIfOk error', result.unwrap_err(), item)
    }
    return validItems
  }, [])

export { mapExceptError, mapIfOk }
