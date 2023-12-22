import { Message, Middleware, mediator } from 'mediateur';
import { decode } from 'next-auth/jwt';
import { Utilisateur } from '@potentiel-domain/utilisateur';

type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

export const middleware: Middleware = async (message, next) => {
  const sessionToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  const accessToken = decoded?.accessToken || '';

  const utilisateur = Utilisateur.convertirEnValueType(accessToken);

  console.log(utilisateur.nom);
  console.log(utilisateur.role);

  utilisateur.role.vérifierLaPermission(message.type);

  await next();
};
