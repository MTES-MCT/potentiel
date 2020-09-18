import { ResultAsync as OldResultAsync, Result as OldResult } from '../../types'

import { ResultAsync, Result, ok, err } from 'neverthrow'

export { Result, ResultAsync, ok, okAsync, err, errAsync } from 'neverthrow'

export const fromOldResultAsync = <T>(
  oldResultAsync: OldResultAsync<T>
): ResultAsync<T, Error> => {
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

export const UnwrapForTest = <T, E>(res: Result<T, E>) => {
  if (res.isOk()) return res.value
  throw 'Result is error, cannot unwrap'
}
