import { User } from '../entities'

export type HttpRequest = {
  body: any
  query: any
  params: any
  user: User
  file?: any
}

export type HttpResponse =
  | {
      statusCode: number
      body: string
    }
  | { redirect: string; user?: Partial<User>; query?: Record<string, any> }

export type Controller = (
  req: HttpRequest,
  context?: any // To add additionnal context if a controller is called by another
) => Promise<HttpResponse>
