import { mediator } from 'mediateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { Abandon } from '@potentiel-domain/laureat';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const accessToken = await mediator.send<GetAccessTokenMessage>({
    type: 'GET_ACCESS_TOKEN',
    data: {},
  });
  const utilisateur = Utilisateur.convertirEnValueType(accessToken);

  const modèleRéponse = await mediator.send<Abandon.GénérerModèleRéponseAbandonQuery>({
    type: 'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    data: {
      identifiantProjet,
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
    },
  });

  return new Response(modèleRéponse.content, {
    headers: {
      'content-type': modèleRéponse.format,
    },
  });
};
