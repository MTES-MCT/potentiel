import { Message, Middleware, mediator } from 'mediateur';
import { Utilisateur } from '@potentiel-domain/utilisateur';

type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

export const middleware: Middleware = async (message, next) => {
  if (message.type === 'GET_ACCESS_TOKEN' || message.type === 'VERIFIER_ACCES_PROJET_QUERY') {
    return await next();
  }

  const accessToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });

  const utilisateur = Utilisateur.convertirEnValueType(accessToken);
  utilisateur.role.vérifierLaPermission(message.type);

  return await next();
};
