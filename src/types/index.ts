import { Result, Option, Err } from '@usefultools/monads'
import { logger } from '@core/utils'

// For monads

const ErrorResult = <T>(error: string) => Err<T, Error>(new Error(error))

export { Option, Result, Ok, Err, Some, None } from '@usefultools/monads'
export { ErrorResult }

export type ResultAsync<T> = Promise<Result<T, Error>>
export type OptionAsync<T> = Promise<Option<T>>

export const UnwrapForTest = <T>(res: Result<T, Error>) => {
  if (res.is_ok()) return res.unwrap()
  logger.error(res.unwrap_err())
  throw new Error('UnwrapForTest: Result is error, cannot unwrap')
}

interface Pagination {
  page: number
  pageSize: number
}

interface PaginatedList<T> {
  items: Array<T>
  pagination: Pagination
  pageCount: number
  itemCount: number
}

export { Pagination, PaginatedList }
