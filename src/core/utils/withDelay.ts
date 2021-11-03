import { Result, ResultAsync } from './Result'

export type WithDelay = <T, E>(
  delayInMs: number,
  callback: () => Result<T, E> | ResultAsync<T, E>
) => ResultAsync<T, E>

export const withDelay: WithDelay = <T, E>(
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
