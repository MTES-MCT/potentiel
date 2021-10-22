import { Result, ResultAsync } from './Result'

export const withDelay = <T, E>(
  delayInMs: number,
  callback: () => Result<T, E> | ResultAsync<T, E>
): ResultAsync<T, E> => {
  return ResultAsync.fromPromise(
    new Promise((resolve, reject) => {
      setTimeout(async () => {
        await callback().match(resolve, reject)
      }, delayInMs)
    }),
    (e) => e as E
  )
}
