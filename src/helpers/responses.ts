import { User } from '../entities'
import { HttpResponse } from '../types'

const Success = (body: string, logout?: boolean): HttpResponse => {
  // console.log('Calling success with body', body)
  return {
    statusCode: 200,
    body,
    logout,
  }
}

const SuccessFile = (filePath: string): HttpResponse => {
  return {
    filePath,
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

export { Success, SuccessFile, NotFoundError, SystemError, Redirect }
