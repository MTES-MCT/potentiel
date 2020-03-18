import { User } from '../entities'
import { HttpResponse } from '../types'

const Success = (body: string): HttpResponse => ({
  statusCode: 200,
  body
})

const ErrorWithCode = (statusCode: number) => (body: string) => ({
  statusCode,
  body
})

const NotFoundError = ErrorWithCode(404)
const SystemError = ErrorWithCode(500)

const Redirect = (route: string, query?: any, userId?: User['id']) => ({
  redirect: route,
  query,
  userId
})

export { Success, NotFoundError, SystemError, Redirect }
