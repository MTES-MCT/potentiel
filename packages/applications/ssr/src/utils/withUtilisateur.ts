import { GetAuthenticatedUserMessage } from '@/utils/getAuthenticatedUser.handler';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const utilisateur = await mediator.send<GetAuthenticatedUserMessage>({
    type: 'GET_AUTHENTICATED_USER',
    data: {},
  });

  return await action(utilisateur);
}
