import { describe, expect, it, jest } from '@jest/globals';
import express, { RequestHandler } from 'express';
import { okAsync } from '../../core/utils';
import { User } from '../../entities';
import { GetUserByEmail, UserRole } from '../../modules/users';
import { makeFakeCreateUser } from '../../__tests__/fakes';
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware';
import { IdentifiantUtilisateur, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

describe(`attachUserToRequestMiddleware`, () => {
  const staticPaths = ['/fonts', '/css', '/images', '/scripts', '/main'];
  staticPaths.forEach((path) => {
    describe(`when the path starts with ${path}`, () => {
      const request = {
        path,
      } as express.Request;
      const nextFunction = jest.fn();
      const getUtilisateur = jest.fn(() => Promise.resolve(undefined));

      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn<GetUserByEmail>(),
        createUser: makeFakeCreateUser(),
        getUtilisateur,
      });
      middleware(request, {} as express.Response, nextFunction);

      it('should not attach the user to the request and execute the next function', () => {
        expect(request.user).toBeUndefined();
        expect(getUtilisateur).not.toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalled();
      });
    });
  });

  describe(`when the path is not a static one`, () => {
    const request = { path: '/a-protected-path' } as express.Request;
    const makeFakeGetUtilisateur = (role: string, username: string) => async () => {
      return {
        ...Utilisateur.bind({
          groupe: Option.none,
          identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(username),
          nom: '',
          role: Role.convertirEnValueType(role),
        }),
        accountUrl: '',
      };
    };
    describe(`when there is no user email in the keycloak access token`, () => {
      const middleware = makeAttachUserToRequestMiddleware({
        getUserByEmail: jest.fn<GetUserByEmail>(),
        createUser: makeFakeCreateUser(),
        getUtilisateur: makeFakeGetUtilisateur('admin', ''),
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
            getUtilisateur: makeFakeGetUtilisateur('', userEmail),
          });

          it('should not attach the user to the request and execute the next function', async () => {
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
            getUtilisateur: makeFakeGetUtilisateur(tokenUserRole, userEmail),
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
            getUtilisateur: makeFakeGetUtilisateur('porteur-projet', userEmail),
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
            getUtilisateur: makeFakeGetUtilisateur(userRole, userEmail),
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
