import express from 'express'
import { okAsync } from '../../core/utils'
import { User } from '../../entities'
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware'

describe(`attachUserToRequestMiddleware`, () => {
  const getUserByEmail = jest.fn()
  const registerFirstUserLogin = jest.fn()

  const middleware = makeAttachUserToRequestMiddleware({
    getUserByEmail,
    registerFirstUserLogin,
  })

  const staticPaths = ['/fonts', '/css', '/images', '/scripts', '/main', '/']
  staticPaths.forEach((path) => {
    describe(`when the path starts with ${path}`, () => {
      const request = {
        path,
      } as express.Request
      const nextFunction = jest.fn()

      middleware(request, {} as express.Response, nextFunction)

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined()
        expect(nextFunction).toHaveBeenCalled()
      })
    })
  })

  describe(`when the path is not a static one`, () => {
    const hasRealmRole = jest.fn()

    const request = {
      path: '/a-protected-path',
    } as express.Request
    const token = {
      content: {},
      hasRealmRole,
    }
    request['kauth'] = { grant: { access_token: token } }

    describe(`when there is no user email in the keycloak access token`, () => {
      token.content['email'] = undefined
      const nextFunction = jest.fn()

      middleware(request, {} as express.Response, nextFunction)

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined()
        expect(nextFunction).toHaveBeenCalled()
      })
    })
  })
})
