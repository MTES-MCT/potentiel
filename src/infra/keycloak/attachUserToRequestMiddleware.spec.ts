import express from 'express'
import { okAsync } from '../../core/utils'
import { User } from '../../entities'
import { GetUserByEmail, makeCreateUser } from '../../modules/users'
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware'

describe(`attachUserToRequestMiddleware`, () => {
  const staticPaths = ['/fonts', '/css', '/images', '/scripts', '/main', '/']
  staticPaths.forEach((path) => {
    describe(`when the path starts with ${path}`, () => {
      const request = {
        path,
      } as express.Request
      const nextFunction = jest.fn()

      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
      })
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

      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
      })
      middleware(request, {} as express.Response, nextFunction)

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined()
        expect(nextFunction).toHaveBeenCalled()
      })
    })

    describe(`when there is a user email in the keycloak access token`, () => {
      describe(`when no role in the keycloak access token`, () => {
        const hasRealmRole = jest.fn(() => false)

        const request = {
          path: '/a-protected-path',
        } as express.Request

        const token = {
          content: {},
          hasRealmRole,
        }
        request['kauth'] = { grant: { access_token: token } }

        token.content['email'] = 'user@email.com'

        const nextFunction = jest.fn()

        const middleware = makeAttachUserToRequestMiddleware({
          getUserByEmail: jest.fn(),
          createUser: jest.fn(),
        })
        middleware(request, {} as express.Response, nextFunction)

        it('should not attach the user to the request and execute the next function', () => {
          expect(request.user).toBeUndefined()
          expect(nextFunction).toHaveBeenCalled()
        })
      })

      describe(`when a user role is in the keycloak access token`, () => {
        describe(`when the user exists in Potentiel`, () => {
          const userRole = 'admin'
          const hasRealmRole = jest.fn((role) => (role === userRole ? true : false))

          const request = {
            path: '/a-protected-path',
          } as express.Request

          const token = {
            content: {},
            hasRealmRole,
          }
          request['kauth'] = { grant: { access_token: token } }

          const userEmail = 'user@email.com'

          token.content['email'] = userEmail

          const user: User = {
            email: userEmail,
            fullName: 'User',
            id: 'user-id',
            isRegistered: true,
            role: userRole,
          }

          const getUserByEmail: GetUserByEmail = jest.fn((email) =>
            email === userEmail ? okAsync(user) : okAsync(null)
          )

          const nextFunction = jest.fn()

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser: jest.fn(),
          })
          middleware(request, {} as express.Response, nextFunction)

          it('should attach the user to the request and execute the next function', () => {
            expect(request.user).toMatchObject(user)
            expect(nextFunction).toHaveBeenCalled()
          })
        })

        describe(`when the user does not exist in Potentiel`, () => {
          const userRole = 'admin'
          const hasRealmRole = jest.fn((role) => (role === userRole ? true : false))

          const request = {
            path: '/a-protected-path',
          } as express.Request

          const token = {
            content: {},
            hasRealmRole,
          }
          request['kauth'] = { grant: { access_token: token } }

          const userEmail = 'user@email.com'
          const userName = 'User'

          token.content['email'] = userEmail
          token.content['name'] = userName
          const getUserByEmail: GetUserByEmail = jest.fn(() => okAsync(null))

          const userId = 'user-id'
          const createUser: ReturnType<typeof makeCreateUser> = jest.fn(() => okAsync(userId))

          const nextFunction = jest.fn()

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser,
          })
          middleware(request, {} as express.Response, nextFunction)

          it('should attach the user to the request and execute the next function', () => {
            const expectedUser: User = {
              email: userEmail,
              fullName: userName,
              id: userId,
              role: userRole,
              isRegistered: true,
            }
            expect(request.user).toMatchObject(expectedUser)
            expect(nextFunction).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
