import { mediator } from 'mediateur';
import { extension } from 'mime-types';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery, DocumentProjet } from '@potentiel-domain/document';
import { Recours } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

import { récupérerProjet } from '../../../_helpers';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
const logger = getLogger('Ssr.candidatures.[identifiant].telecharger-attestation.route.GET');

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const documentProjet = await getDocumentKey(identifiantProjet);

  if (!documentProjet) {
    // TODO : C'est une erreur, pas un warning sinon on ne peut pas récupérer l'info dans Sentry.
    // Dans ce cas de figure, il manque un helper similaire PageWithErrorHandling pour les routes type API ou Document.
    // Si à l'avenir on ajoute ce type d'helper il faudrait throw un erreur directement dans getDocumentKey.
    logger.error(new Error(`La clé de l'attestation n'existe pas`), { identifiantProjet });
    return notFound();
  }

  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: documentProjet.formatter(),
    },
  });

  const { nom: nomProjet } = await récupérerProjet(identifiantProjet);

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
      'content-disposition': `attachment; filename="attestation-${encodeURIComponent(nomProjet)}.${extension(result.format)}"`,
    },
  });
};

const getDocumentKey = async (
  identifiantProjet: string,
): Promise<DocumentProjet.ValueType | undefined> => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature) || !candidature.notification) {
    return undefined;
  }

  if (candidature.statut.estÉliminé()) {
    const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isSome(recours) && recours.demande.accord) {
      return recours.demande.accord.réponseSignée;
    }
  }

  return candidature.notification.attestation;
};
