import { Abandon } from '@potentiel-domain/laureat';
import { mediator } from 'mediateur';
import { redirect } from 'next/navigation';

import { decodeParameter } from '@/utils/decodeParameter';
import { getUser } from '@/utils/getUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const utilisateur = await getUser();
  if (!utilisateur) {
    redirect('/login.html');
  }

  const modèleRéponse = await mediator.send<Abandon.GénérerModèleRéponseAbandonQuery>({
    type: 'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    data: {
      identifiantProjet,
      identifiantUtilisateur: utilisateur.email,
    },
  });

  return new Response(modèleRéponse.content, {
    headers: {
      'content-type': modèleRéponse.format,
    },
  });
};
