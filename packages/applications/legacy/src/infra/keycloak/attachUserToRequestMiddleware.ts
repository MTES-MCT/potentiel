import { NextFunction, Request, Response } from 'express';
import { logger, ResultAsync } from '../../core/utils';
import { CreateUser, GetUserByEmail } from '../../modules/users';
import { getPermissions, Permission } from '../../modules/authN';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { getToken, GetTokenParams } from 'next-auth/jwt';
import { PlainType } from '@potentiel-domain/core';

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
  getUtilisateur?: (req: Request) => Promise<Utilisateur.ValueType | undefined>;
};

// The token is generated by next-auth on the SSR app
declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    utilisateur?: PlainType<Utilisateur.ValueType>;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      email: string;
      role: Role.RawType;
      fullName: string;
      id: string;
      accountUrl: string;
      permissions: Permission[];
    };
  }
}

const getNextAuthUtilisateur = async (req: Request) => {
  try {
    const token = await getToken({
      req: { cookies: req.cookies } as unknown as GetTokenParams['req'],
    });
    return token?.utilisateur && Utilisateur.bind(token.utilisateur);
  } catch (e) {
    logger.error('getToken failed');
    logger.error(e);
  }
};

const promisify = <T>(resultAsync: ResultAsync<T, unknown>) =>
  new Promise<T>((resolve, reject) => resultAsync.match(resolve, reject));

const makeAttachUserToRequestMiddleware =
  ({
    getUserByEmail,
    createUser,
    getUtilisateur = getNextAuthUtilisateur,
  }: AttachUserToRequestMiddlewareDependencies) =>
  async (request: Request, response: Response, next: NextFunction) => {
    if (
      // Theses paths should be prefixed with /static in the future
      request.path.startsWith('/fonts') ||
      request.path.startsWith('/css') ||
      request.path.startsWith('/images') ||
      request.path.startsWith('/scripts') ||
      request.path.startsWith('/main') ||
      request.path.startsWith('/illustrations')
    ) {
      next();
      return;
    }

    try {
      const utilisateur = await getUtilisateur(request);
      if (!utilisateur) {
        next();
        return;
      }

      const {
        identifiantUtilisateur: { email },
        role: { nom: role },
        nom: fullName,
      } = utilisateur;

      const getOrCreateUser = async () => {
        const createUserArgs = { email, role, fullName };
        const user = await promisify(getUserByEmail(email));
        if (user) return { id: user.id, ...createUserArgs };

        const { id } = await promisify(createUser(createUserArgs));
        return { id, ...createUserArgs };
      };
      const user = await getOrCreateUser();

      request.user = {
        ...user,
        accountUrl: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`,
        permissions: getPermissions(user),
      };
    } catch (e) {
      logger.error('Auth failed');
      logger.error(e);
    }
    next();
  };

export { makeAttachUserToRequestMiddleware };
