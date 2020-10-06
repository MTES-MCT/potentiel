import { User } from '../entities'
import { HttpResponse } from '../types'
import { Readable } from 'stream'

const Success = (
  body: string | Record<string, any>,
  options?: {
    logout?: boolean
    cookies?: Record<string, any>
  }
): HttpResponse => {
  // console.log('Calling success with body', body)
  return {
    statusCode: 200,
    body,
    logout: options?.logout,
    cookies: options?.cookies,
  }
}

const SuccessFile = (filePath: string): HttpResponse => {
  return {
    filePath,
  }
}

const SuccessFileStream = (fileStream: NodeJS.ReadableStream): HttpResponse => {
  return {
    fileStream,
  }
}

const ErrorWithCode = (statusCode: number) => (body: string) => ({
  statusCode,
  body,
})

const NotFoundError = ErrorWithCode(404)
const SystemError = ErrorWithCode(500)

const Redirect = (
  route: string,
  query?: any,
  userId?: User['id'],
  logout?: boolean
) => ({
  redirect: route,
  query,
  userId,
  logout,
})

export {
  Success,
  SuccessFile,
  SuccessFileStream,
  NotFoundError,
  SystemError,
  Redirect,
}
