import { Message, mediator } from 'mediateur';

import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { AuthenticatedUserReadModel } from '@/utils/getAuthenticatedUser.handler';

import { NoAuthenticatedUserError } from './NoAuthenticatedUser.error';

type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType & { régionDreal: Option.Type<string> }
>;

export async function withUtilisateur<TResult>(
  action: (Utilisateur: AuthenticatedUserReadModel) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await mediator.send<GetAuthenticatedUserMessage>({
    type: 'System.Authorization.RécupérerUtilisateur',
    data: {},
  });

  if (Option.isNone(utilisateur)) {
    throw new NoAuthenticatedUserError();
  }

  return await action(utilisateur);
}
