import { mediator } from 'mediateur';
import { NextRequest, NextResponse } from 'next/server';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { InvalidOperationError } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getErrorUrl } from '@/utils/error/getErrorUrl';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
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

    if (Option.isNone(modèleRéponse)) {
      getLogger().error(
        new InvalidOperationError(
          'Erreur lors de la génération du modèle de mise en demeure des garanties financières',
          {
            utilisateur: {
              email: utilisateur.identifiantUtilisateur.email,
              role: utilisateur.role.nom,
            },
            identifiantProjet: identifiantProjetValue,
          },
        ),
      );
      return NextResponse.redirect(getErrorUrl(request));
    }

    return new NextResponse(modèleRéponse.content, {
      headers: {
        'content-type': modèleRéponse.format,
      },
    });
  });
