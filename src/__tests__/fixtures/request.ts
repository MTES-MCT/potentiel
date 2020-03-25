import { HttpRequest } from '../../types'
import makeFakeUser from './user'

export default function makeFakeRequest(
  overrides?: Partial<HttpRequest>
): HttpRequest {
  const defaultObj = {
    body: {},
    query: {},
    params: {},
    user: makeFakeUser()
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
