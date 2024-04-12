import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjetValue = decodeParameter(identifiant);

    const modèleRéponse =
      await mediator.send<GarantiesFinancières.GénérerModèleMiseEnDemeureGarantiesFinancièresQuery>(
        {
          type: 'Document.Query.GénérerModèleMideEnDemeureGarantiesFinancières',
          data: {
            identifiantProjetValue,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.email,
            dateCourrierValue: new Date().toISOString(),
          },
        },
      );

    return new Response(modèleRéponse.content, {
      headers: {
        'content-type': modèleRéponse.format,
      },
    });
  });
