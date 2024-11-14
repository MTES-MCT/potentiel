import { describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import { okAsync } from '../../core/utils';
import { User } from '../../entities';
import { GetUserByEmail, UserRole } from '../../modules/users';
import { makeFakeCreateUser } from '../../__tests__/fakes';
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware';

describe(`attachUserToRequestMiddleware`, () => {
  const staticPaths = ['/fonts', '/css', '/images', '/scripts', '/main'];
  staticPaths.forEach((path) => {
    describe(`when the path starts with ${path}`, () => {
      const request = {
        path,
      } as express.Request;
      const nextFunction = jest.fn();
      const getAccessToken = jest.fn(() => Promise.resolve(undefined));

      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn<GetUserByEmail>(),
        createUser: makeFakeCreateUser(),
        getAccessToken,
      });
      middleware(request, {} as express.Response, nextFunction);

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined();
        expect(getAccessToken).not.toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalled();
      });
    });
  });

  describe(`when the path is not a static one`, () => {
    const request = { path: '/a-protected-path' } as express.Request;
    const makeFakeGetAccessToken = (role: string, username: string) => async () => {
      const iat = Math.floor(Date.now() / 1000);
      const claims = {
        exp: iat,
        iat: iat + 300,
        auth_time: iat,
        jti: 'jti',
        iss: 'http://localhost:8080/realms/Potentiel',
        aud: ['realm-management', 'account'],
        sub: 'sub',
        typ: 'Bearer',
        azp: 'potentiel-web',
        sid: 'sid',
        acr: '0',
        realm_access: {
          roles: [role],
        },
        scope: 'openid email profile',
        email_verified: true,
        name: 'Admin Test',
        preferred_username: username,
        given_name: 'Admin',
        family_name: 'Test',
        email: username,
      };
      return `xx.${btoa(JSON.stringify(claims))}.xx`;
    };
    describe(`when there is no user email in the keycloak access token`, () => {
      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn<GetUserByEmail>(),
        createUser: makeFakeCreateUser(),
        getAccessToken: makeFakeGetAccessToken('admin', ''),
      });

      it('should not attach the user to the request and execute the next function', async () => {
        const nextFunction = jest.fn();
        await middleware(request, {} as express.Response, nextFunction);
        expect(request.user).toBeUndefined();
        expect(nextFunction).toHaveBeenCalled();
      });
    });

    describe(`when there is a user email in the keycloak access token`, () => {
      describe(`when the user exists in Potentiel`, () => {
        describe(`when no role in the keycloak access token`, () => {
          const userEmail = 'user@email.com';

          const user: User = {
            email: userEmail,
            id: 'user-id',
            role: undefined as unknown as UserRole,
          };

          const getUserByEmail = jest.fn<GetUserByEmail>((email) =>
            email === userEmail ? okAsync({ ...user, role: 'porteur-projet' }) : okAsync(null),
          );

          const nextFunction = jest.fn();

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser: makeFakeCreateUser(),
            getAccessToken: makeFakeGetAccessToken('', userEmail),
          });

          it('should not attach the user to the request', async () => {
            await middleware(request, {} as express.Response, nextFunction);
            expect(request.user).toBeUndefined();
            expect(nextFunction).toHaveBeenCalled();
          });
        });

        describe(`when there is a role in the keycloak access token`, () => {
          const tokenUserRole = 'admin';

          const userEmail = 'user@email.com';

          const user: User = {
            email: userEmail,
            id: 'user-id',
            role: 'porteur-projet',
          };

          const getUserByEmail: GetUserByEmail = jest.fn((email) =>
            email === userEmail ? okAsync(user) : okAsync(null),
          );

          const nextFunction = jest.fn();

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser: makeFakeCreateUser(),
            getAccessToken: makeFakeGetAccessToken(tokenUserRole, userEmail),
          });

          it('should attach the user to the request with role from token', async () => {
            const expectedUser = {
              ...user,
              role: tokenUserRole,
              accountUrl: expect.any(String),
            };
            await middleware(request, {} as express.Response, nextFunction);
            expect(request.user).toMatchObject(expectedUser);

            expect(nextFunction).toHaveBeenCalled();
          });
        });
      });

      describe(`when the user does not exist in Potentiel`, () => {
        describe(`when no role in the keycloak access token`, () => {
          const userEmail = 'user@email.com';

          const getUserByEmail: GetUserByEmail = jest.fn(() => okAsync(null));

          const userId = 'user-id';
          const createUser = makeFakeCreateUser({ id: userId, role: 'porteur-projet' });

          const nextFunction = jest.fn();

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser,
            getAccessToken: makeFakeGetAccessToken('porteur-projet', userEmail),
          });

          it('should attach a new user to the request', async () => {
            await middleware(request, {} as express.Response, nextFunction);
            expect(request.user).toMatchObject({
              email: userEmail,
              id: userId,
              role: 'porteur-projet',
              accountUrl: expect.any(String),
              permissions: expect.anything(),
            });

            expect(nextFunction).toHaveBeenCalled();
          });
        });

        describe(`when there is a role in the keycloak access token`, () => {
          const userRole = 'admin';

          const userEmail = 'user@email.com';

          const getUserByEmail: GetUserByEmail = jest.fn(() => okAsync(null));

          const userId = 'user-id';
          const createUser = makeFakeCreateUser({ id: userId, role: userRole });

          const nextFunction = jest.fn();

          const middleware = makeAttachUserToRequestMiddleware({
            getUserByEmail,
            createUser,
            getAccessToken: makeFakeGetAccessToken(userRole, userEmail),
          });

          it('should attach a new user to the request with the same role of the token', async () => {
            await middleware(request, {} as express.Response, nextFunction);
            expect(request.user).toMatchObject({
              email: userEmail,
              id: userId,
              role: userRole,
              accountUrl: expect.any(String),
              permissions: expect.anything(),
            });

            expect(nextFunction).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
