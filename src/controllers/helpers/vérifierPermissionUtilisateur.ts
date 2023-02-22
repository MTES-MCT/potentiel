import { RequestHandler } from 'express';
import { Permission } from '@modules/authN';
import routes from '@routes';
import { AccèsNonAutoriséPage } from '@views';

export const vérifierPermissionUtilisateur =
  (permission: Permission): RequestHandler =>
  (request, response, next) => {
    const { user } = request;
    if (!user) {
      response.redirect(routes.LOGIN);
      return;
    }

    if (!user.permissions.includes(permission)) {
      response.send(AccèsNonAutoriséPage({ request, fonctionnalité: permission.description }));
      return;
    }

    next();
  };
