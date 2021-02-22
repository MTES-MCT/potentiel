import { Request } from 'express'
import makeFakeUser from './user'
import { User } from '../../entities'

export default function makeFakeRequest(
  overrides?: Partial<Request>,
  userOverrides?: Partial<User>
) {
  const defaultObj = {
    body: {},
    query: {},
    params: {},
    user: makeFakeUser(userOverrides),
  }

  return {
    ...defaultObj,
    ...overrides,
  } as Request
}
