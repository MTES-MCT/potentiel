import { mediator } from 'mediateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { Abandon } from '@potentiel-domain/laureat';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

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
  });
