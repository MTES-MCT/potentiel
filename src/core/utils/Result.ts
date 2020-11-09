import { err, ok, Result, ResultAsync } from 'neverthrow'
import { Result as OldResult, ResultAsync as OldResultAsync } from '../../types'

export { err, errAsync, ok, okAsync, Result, ResultAsync } from 'neverthrow'

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
  if (oldResult.is_err()) {
    return err(oldResult.unwrap_err())
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
