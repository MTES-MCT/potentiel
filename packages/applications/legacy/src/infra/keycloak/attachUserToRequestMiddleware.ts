import { NextFunction, Request, Response } from 'express';
import { logger, ok } from '../../core/utils';
import { CreateUser, GetUserByEmail, USER_ROLES } from '../../modules/users';
import { getPermissions } from '../../modules/authN';
import { Utilisateur } from '@potentiel-domain/utilisateur';

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
};

const makeAttachUserToRequestMiddleware =
  ({ getUserByEmail, createUser }: AttachUserToRequestMiddlewareDependencies) =>
  async (request: Request, response: Response, next: NextFunction) => {
    if (
      // Theses paths should be prefixed with /static in the future
      request.path.startsWith('/fonts') ||
      request.path.startsWith('/css') ||
      request.path.startsWith('/images') ||
      request.path.startsWith('/scripts') ||
      request.path.startsWith('/main')
    ) {
      next();
      return;
    }

    const accessToken = request?.token?.accessToken as string;

    if (accessToken) {
      const {
        identifiantUtilisateur: { email },
        role: { nom: role },
        nom: fullName,
      } = Utilisateur.convertirEnValueType(accessToken);
      await getUserByEmail(email)
        .andThen((user) => {
          if (user) {
            return ok({ ...user, role });
          }
          const createUserArgs = { email, role, fullName };

          return createUser(createUserArgs).andThen(({ id }) => {
            return ok({ ...createUserArgs, id });
          });
        })
        .match(
          (user) => {
            request.user = {
              ...user,
              accountUrl: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`,
              permissions: getPermissions(user),
            };
          },
          (e: Error) => {
            logger.error(e);
          },
        );
    }

    next();
  };

export { makeAttachUserToRequestMiddleware };
