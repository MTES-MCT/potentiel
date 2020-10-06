import { User } from '../entities'
import { Result, Option, Err, Ok, Some } from '@usefultools/monads'

import { OptSome, OptNone } from '@usefultools/monads/dist/Option/Option'
import { ResOk, ResErr } from '@usefultools/monads/dist/Result/Result'

import { Readable } from 'stream'

import { Null } from './schemaTypes'

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
  throw 'Result is error, cannot unwrap'
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
