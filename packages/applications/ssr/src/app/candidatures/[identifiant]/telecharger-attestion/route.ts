import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const logger = getLogger();

    const identifiantProjet = decodeParameter(identifiant);

    const rôleUtilisateur = utilisateur.role;

    const canPreviewAttestation = rôleUtilisateur.aLaPermission(
      'candidature.attestation.prévisualiser',
    );

    if (!canPreviewAttestation) {
      throw new AccèsFonctionnalitéRefuséError(
        'candidature.attestation.prévisualiser',
        rôleUtilisateur.nom,
      );
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    if (
      Option.isNone(candidature) ||
      (Option.isSome(candidature) && candidature.statut.estNonNotifié())
    ) {
      logger.warn(`Candidature non trouvée ou candidature non notifiée`, { identifiantProjet });
      return notFound();
    }

    // chercher lauréat ou éliminé
    if (candidature.statut.estClassé()) {
      // on load le lauréat
    }

    // chercher éliminé
    if (candidature.statut.estÉliminé()) {
      // on load l'éliminé
    }

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey,
      },
    });

    return new Response(result.content, {
      headers: {
        'content-type': result.format,
      },
    });
  });
