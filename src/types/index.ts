import { User } from '../entities'
import { Result, Option, Err } from '@usefultools/monads'
import { logger } from '../core/utils'

export type HttpRequest = {
  body: any
  query: any
  params: any
  user?: User
  file?: any
  cookies?: Record<string, any>
}

export type HttpResponse =
  | {
      statusCode: number
      body: string | Record<string, any>
      cookies?: Record<string, any>
      logout?: boolean
    }
  | {
      filePath: string
    }
  | {
      /* global NodeJS */
      fileStream: NodeJS.ReadableStream
    }
  | {
      redirect: string
      userId?: User['id']
      query?: Record<string, any>
      logout?: boolean
    }

export type Controller = (
  req: HttpRequest,
  context?: any // To add additionnal context if a controller is called by another
) => Promise<HttpResponse>

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
