import express from 'express'
import { okAsync } from '../../core/utils'
import { User } from '../../entities'
import { CreateUser, GetUserByEmail } from '../../modules/users'
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

          const userEmail = 'user@email.com'
          const userName = 'User'

          token.content['email'] = userEmail
          token.content['name'] = userName
          const getUserByEmail: GetUserByEmail = jest.fn(() => okAsync(null))

          const userId = 'user-id'
          const createUser: CreateUser = jest.fn(() =>
            okAsync({ id: userId, role: 'porteur-projet' })
          )

          const nextFunction = jest.fn()

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser,
          })
          middleware(request, {} as express.Response, nextFunction)

          it('should attach a new user to the request', () => {
            const expectedUser: User = {
              email: userEmail,
              fullName: userName,
              id: userId,
              role: 'porteur-projet',
            }
            expect(request.user).toMatchObject(expectedUser)
          })

          it('should execute the next function', () => {
            expect(nextFunction).toHaveBeenCalled()
          })
        })

        describe(`when there is a role in the keycloak access token`, () => {
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
          const createUser: CreateUser = jest.fn(() => okAsync({ id: userId, role: userRole }))

          const nextFunction = jest.fn()

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser,
          })
          middleware(request, {} as express.Response, nextFunction)

          it('should attach a new user to the request with the same role of the token', () => {
            const expectedUser: User = {
              email: userEmail,
              fullName: userName,
              id: userId,
              role: userRole,
            }
            expect(request.user).toMatchObject(expectedUser)
          })

          it('should execute the next function', () => {
            expect(nextFunction).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
