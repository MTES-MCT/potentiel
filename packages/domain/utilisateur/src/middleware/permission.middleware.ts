import { Middleware } from 'mediateur';
import * as Utilisateur from '../utilisateur.valueType';
import { WrongTokenTypeError } from '../token.error';

export const permissionMiddleware: Middleware = async (message, next) => {
  const utilisateurValue = message.data['utilisateurValue'];

  if (typeof utilisateurValue === 'string') {
    const utilisateur = Utilisateur.convertirEnValueType(utilisateurValue);

    utilisateur.role.vérifierLaPermission(message.type);

    return await next();
  }

  throw new WrongTokenTypeError(typeof utilisateurValue);
};
