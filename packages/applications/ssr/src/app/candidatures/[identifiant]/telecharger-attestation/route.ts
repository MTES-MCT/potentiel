import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery, DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

import { récupérerProjet } from '../../../_helpers';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
const logger = getLogger();

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const documentKey = await getDocumentKey(identifiantProjet);

  if (!documentKey) {
    logger.warn(`La clé de l'attestation n'existe pas`, { identifiantProjet });
    return notFound();
  }

  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: documentKey.formatter(),
    },
  });

  const { nom: nomProjet } = await récupérerProjet(identifiantProjet);

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
      'content-disposition': `attachment; filename="attestation-${nomProjet}.pdf"`,
    },
  });
};

const getDocumentKey = async (
  identifiantProjet: string,
): Promise<DocumentProjet.ValueType | null> => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(lauréat)) {
    return lauréat.attestation;
  } else {
    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isSome(éliminé)) {
      return éliminé.attestation;
    }
  }

  return null;
};