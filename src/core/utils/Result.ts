import { err, ok, Result, ResultAsync } from 'neverthrow'
import { Result as OldResult, ResultAsync as OldResultAsync } from '../../types'

export {
  err,
  errAsync,
  ok,
  okAsync,
  Result,
  ResultAsync,
  combine,
  combineWithAllErrors,
} from 'neverthrow'

export const fromOldResultAsync = <T>(oldResultAsync: OldResultAsync<T>): ResultAsync<T, Error> => {
  return ResultAsync.fromPromise(
    oldResultAsync,
    () => new Error('failed to transform old ResultAsync to new ResultAsync')
  ).andThen((oldResult: OldResult<T, Error>) =>
    oldResult.match<Result<T, Error>>({
      ok: (value: T) => ok(value),
      err: (e: Error) => err(e),
    })
  )
}

export const fromOldResult = <T>(oldResult: OldResult<T, Error>): Result<T, Error> => {
  if (oldResult.isErr()) {
    return err(oldResult.unwrapErr())
  }

  return ok(oldResult.unwrap())
}

export const UnwrapForTest = <T, E>(res: Result<T, E>) => {
  if (res.isOk()) return res.value
  throw new Error('Result is error, cannot unwrap')
}

export const mapResults = <T, K, E>(
  items: T[],
  fn: (item: T) => ResultAsync<K, E>
): ResultAsync<K, E> => {
  let result = fn(items[0])
  for (const item of items.slice(1)) {
    result = result.andThen(() => fn(item))
  }

  return result
}

// Identity function used to unwrap a Result<Result<T,E>> into Result<T,E>
// Ex:  ResultOfResult.andThen(unwrapResult) returns a Result
export const unwrapResultOfResult = <T, E>(
  item: ResultAsync<T, E> | Result<T, E>
): ResultAsync<T, E> | Result<T, E> => item
