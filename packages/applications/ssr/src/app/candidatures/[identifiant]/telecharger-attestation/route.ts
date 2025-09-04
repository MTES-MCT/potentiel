import { mediator } from 'mediateur';
import { extension } from 'mime-types';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { apiAction } from '@/utils/apiAction';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(async () => {
    const identifiantProjet = decodeParameter(identifiant);
    const { attestationDésignation, nomProjet } = await getAttestation(identifiantProjet);

    if (!attestationDésignation) {
      // TODO : C'est une erreur, pas un warning sinon on ne peut pas récupérer l'info dans Sentry.
      // Dans ce cas de figure, il manque un helper similaire PageWithErrorHandling pour les routes type API ou Document.
      // Si à l'avenir on ajoute ce type d'helper il faudrait throw un erreur directement dans getDocumentKey.
      getLogger().error(new Error(`La clé de l'attestation n'existe pas`), { identifiantProjet });
      return notFound();
    }

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: attestationDésignation.formatter(),
      },
    });
    if (Option.isNone(result)) {
      return notFound();
    }

    return new Response(result.content, {
      headers: {
        'content-type': result.format,
        'content-disposition': `attachment; filename="attestation-${encodeURIComponent(nomProjet)}.${extension(result.format)}"`,
      },
    });
  });

/**
 * Candidat lauréat : attestation de désignation
 * Candidat éliminé avec recours accordé : courrier de réponse de l'accord du recours
 * Candidat éliminé : avis de rejet
 *
 * Certains projets "legacy" n'ont pas d'attestation de désignation dans Potentiel.
 */
const getAttestation = async (identifiantProjet: string) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(lauréat)) {
    if (lauréat.attestationDésignation) {
      return {
        attestationDésignation: lauréat.attestationDésignation,
        nomProjet: lauréat.nomProjet,
      };
    }
    const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isSome(recours) && recours.demande.accord) {
      return {
        attestationDésignation: recours.demande.accord.réponseSignée,
        nomProjet: lauréat.nomProjet,
      };
    }
    // Projet lauréat sans attestation (eg. projet d'un période "legacy")
    return {};
  }

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(éliminé)) {
    return {
      nomProjet: éliminé.nomProjet,
      attestationDésignation: éliminé.attestationDésignation,
    };
  }

  notFound();
};
