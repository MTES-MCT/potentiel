import { Message, Middleware, mediator } from 'mediateur';
import { Utilisateur } from '@potentiel-domain/utilisateur';

type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

export const middleware: Middleware = async (message, next) => {
  const accessToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });

  const utilisateur = Utilisateur.convertirEnValueType(accessToken);

  console.log(utilisateur.nom);
  console.log(utilisateur.role);

  utilisateur.role.vérifierLaPermission(message.type);

  await next();
};
