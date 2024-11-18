import { RequestHandler } from 'express';
import { Permission } from '../../modules/authN';
import { AccèsNonAutoriséPage } from '../../views';
import { Routes } from '@potentiel-applications/routes';

export const vérifierPermissionUtilisateur =
  (permission: Permission): RequestHandler =>
  (request, response, next) => {
    const { user } = request;
    if (!user) {
      response.redirect(Routes.Auth.signIn());
      return;
    }

    if (!user.permissions.includes(permission)) {
      response.send(AccèsNonAutoriséPage({ request, fonctionnalité: permission.description }));
      return;
    }

    next();
  };
