import express from 'express'
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
})
