import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async () => {
    const logger = getLogger();

    const identifiantProjet = decodeParameter(identifiant);

    let documentKey = '';

    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiant,
      },
    });

    if (Option.isSome(lauréat)) {
      documentKey = lauréat.attestation.formatter();
    } else {
      const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
        type: 'Éliminé.Query.ConsulterÉliminé',
        data: {
          identifiantProjet: identifiant,
        },
      });

      if (Option.isNone(éliminé)) {
        logger.warn(`Projet lauréat ou éliminé non trouvé`, { identifiantProjet });
        return notFound();
      } else {
        documentKey = éliminé.attestation.formatter();
      }
    }

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey,
      },
    });

    if (!result) {
      logger.warn(`Attestation pas disponible`, { identifiantProjet });
      return notFound();
    }

    return new Response(result.content, {
      headers: {
        'content-type': result.format,
        'content-disposition': `attachment; filename="attestation-${identifiantProjet}.pdf"`,
      },
    });
  });
