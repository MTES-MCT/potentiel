import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';

export async function withUtilisateur<TResult>(
  action: (Utilisateur: Utilisateur.ValueType) => Promise<TResult>,
): Promise<TResult> {
  const accessToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });

  return await action(Utilisateur.convertirEnValueType(accessToken));
}
