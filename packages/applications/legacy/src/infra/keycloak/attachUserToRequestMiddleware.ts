import { NextFunction, Request, Response } from 'express';
import { logger, ResultAsync } from '../../core/utils';
import { CreateUser, GetUserByEmail } from '../../modules/users';
import { getPermissions, Permission } from '../../modules/authN';
import { Role } from '@potentiel-domain/utilisateur';
import { getContext, PotentielUtilisateur } from '@potentiel-applications/request-context';

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
  getUtilisateur?: () => Promise<PotentielUtilisateur | undefined>;
};

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      email: string;
      role: Role.RawType;
      fullName: string;
      id: string;
      accountUrl?: string;
      permissions: Permission[];
      // région: Option.Type<string>;
      features: Array<string>;
    };
    errorFileSizeLimit?: string;
  }
}

const getNextAuthUtilisateur = async () => getContext()?.utilisateur;

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
      request.path.startsWith('/api') ||
      request.path.startsWith('/csrf') ||
      request.path.startsWith('/auth') ||
      request.path.startsWith('/fonts') ||
      request.path.startsWith('/css') ||
      request.path.startsWith('/images') ||
      request.path.startsWith('/scripts') ||
      request.path.startsWith('/main') ||
      request.path.startsWith('/illustrations') ||
      request.path.startsWith('/js') ||
      request.path.startsWith('/dsfr') ||
      request.path.startsWith('/_next')
    ) {
      next();
      return;
    }

    try {
      const utilisateur = await getUtilisateur();
      if (!utilisateur) {
        next();
        return;
      }

      const {
        identifiantUtilisateur: { email },
        role: { nom: role },
        nom: fullName = '',
        accountUrl,
      } = utilisateur;

      // Ceci couvre le cas où l'utilisateur s'inscrit spontanément sur Potentiel
      // L'utilisateur n'existe alors pas sur la nouvelle app, mais existe dans le legacy
      // En cas d'invitation sur un projet, ou de réclamation d'un projet,
      // l'utilisateur est créé sur la nouvelle app.
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
        accountUrl,
        permissions: getPermissions(user),
        features: getContext()?.features || [],
      };
    } catch (e) {
      logger.error('Auth failed');
      logger.error(e);
    }
    next();
  };

export { makeAttachUserToRequestMiddleware };
