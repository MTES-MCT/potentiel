import { HttpRequest } from '../../types'
import makeFakeUser from './user'
import { User } from '../../entities'

export default function makeFakeRequest(
  overrides?: Partial<HttpRequest>,
  userOverrides?: Partial<User>
): HttpRequest {
  const defaultObj = {
    body: {},
    query: {},
    params: {},
    user: makeFakeUser(userOverrides),
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
