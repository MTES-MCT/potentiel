import { mediator } from 'mediateur';
import { extension } from 'mime-types';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery, DocumentProjet } from '@potentiel-domain/document';
import { Éliminé } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { apiAction } from '@/utils/apiAction';
import { getProjet } from '@/app/_helpers/getProjet';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const documentProjet = await getDocumentKey(identifiantProjet);

    if (!documentProjet) {
      // TODO : C'est une erreur, pas un warning sinon on ne peut pas récupérer l'info dans Sentry.
      // Dans ce cas de figure, il manque un helper similaire PageWithErrorHandling pour les routes type API ou Document.
      // Si à l'avenir on ajoute ce type d'helper il faudrait throw un erreur directement dans getDocumentKey.
      getLogger().error(new Error(`La clé de l'attestation n'existe pas`), { identifiantProjet });
      return notFound();
    }

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: documentProjet.formatter(),
      },
    });
    if (Option.isNone(result)) {
      return notFound();
    }

    const { nomProjet } = await getProjet(identifiantProjet);

    return new Response(result.content, {
      headers: {
        'content-type': result.format,
        'content-disposition': `attachment; filename="attestation-${encodeURIComponent(nomProjet)}.${extension(result.format)}"`,
      },
    });
  });

const getDocumentKey = async (
  identifiantProjet: string,
): Promise<DocumentProjet.ValueType | undefined> => {
  const attestation = await mediator.send<Candidature.ConsulterAttestationQuery>({
    type: 'Candidature.Query.ConsulterAttestation',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(attestation)) {
    return undefined;
  }

  if (attestation.statut.estÉliminé()) {
    const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isSome(recours) && recours.demande.accord) {
      return recours.demande.accord.réponseSignée;
    }
  }

  return attestation.attestation;
};
