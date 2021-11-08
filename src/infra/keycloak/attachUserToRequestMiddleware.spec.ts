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
    describe(`when there is no user email in the keycloak access token`, () => {
      const hasRealmRole = jest.fn()

      const request = {
        path: '/a-protected-path',
      } as express.Request
      const token = {
        content: {},
        hasRealmRole,
      }
      request['kauth'] = { grant: { access_token: token } }

      token.content['email'] = undefined
      const nextFunction = jest.fn()

      middleware(request, {} as express.Response, nextFunction)

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined()
        expect(nextFunction).toHaveBeenCalled()
      })
    })

    describe(`when there is a user email in the keycloak access token`, () => {
      describe(`when no role in the keycloak access token`, () => {
        const hasRealmRole = jest.fn()

        const request = {
          path: '/a-protected-path',
        } as express.Request

        const token = {
          content: {},
          hasRealmRole,
        }
        request['kauth'] = { grant: { access_token: token } }

        token.content['email'] = 'user@email.com'

        hasRealmRole.mockReturnValue(false)
        const nextFunction = jest.fn()

        middleware(request, {} as express.Response, nextFunction)

        it('should not attach the user to the request and execute the next function', () => {
          expect(request.user).toBeUndefined()
          expect(nextFunction).toHaveBeenCalled()
        })
      })

      describe(`when a user role is in the keycloak access token`, () => {
        describe(`when the user exists in Potentiel`, () => {
          const hasRealmRole = jest.fn()

          const request = {
            path: '/a-protected-path',
          } as express.Request

          const token = {
            content: {},
            hasRealmRole,
          }
          request['kauth'] = { grant: { access_token: token } }

          const user: User = {
            email: 'user@email.com',
            fullName: 'User',
            id: 'user-id',
            isRegistered: true,
            role: 'admin',
          }
          const { email: userEmail } = user

          token.content['email'] = userEmail
          getUserByEmail.mockImplementation((email) =>
            email === userEmail ? okAsync(user) : okAsync(null)
          )

          hasRealmRole.mockReturnValue(true)
          const nextFunction = jest.fn()

          middleware(request, {} as express.Response, nextFunction)

          it('should attach the user to the request and execute the next function', () => {
            expect(request.user).toMatchObject(user)
            expect(nextFunction).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
