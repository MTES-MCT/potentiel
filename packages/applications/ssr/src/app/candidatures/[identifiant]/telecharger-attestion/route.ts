import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
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
  withUtilisateur(async (utilisateur) => {
    const logger = getLogger();

    const identifiantProjet = decodeParameter(identifiant);

    const rôleUtilisateur = utilisateur.role;

    // à voir si on garde ça
    const canPreviewAttestation = rôleUtilisateur.aLaPermission(
      'candidature.attestation.télécharger',
    );

    console.log('violette', canPreviewAttestation);

    if (!canPreviewAttestation) {
      throw new AccèsFonctionnalitéRefuséError(
        'candidature.attestation.télécharger',
        rôleUtilisateur.nom,
      );
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    console.log('violette', candidature);

    const attestationPasDisponible =
      Option.isNone(candidature) ||
      (Option.isSome(candidature) &&
        (candidature.statut.estNonNotifié() || candidature.statut.estAbandonné()));

    console.log('violette', attestationPasDisponible);

    if (attestationPasDisponible) {
      logger.warn(`Candidature non trouvée, non notifiée ou abandonnée`, { identifiantProjet });
      return notFound();
    }

    const projetLauréatOuEliminé = candidature.statut.estClassé()
      ? await mediator.send<Lauréat.ConsulterLauréatQuery>({
          type: 'Lauréat.Query.ConsulterLauréat',
          data: {
            identifiantProjet: candidature.identifiantProjet.formatter(),
          },
        })
      : await mediator.send<Éliminé.ConsulterÉliminéQuery>({
          type: 'Éliminé.Query.ConsulterÉliminé',
          data: {
            identifiantProjet: candidature.identifiantProjet.formatter(),
          },
        });

    if (Option.isNone(projetLauréatOuEliminé)) {
      logger.warn(`Candidature éliminé ou classée non trouvée`, { identifiantProjet });
      return notFound();
    }

    const documentKey = projetLauréatOuEliminé.attestation.formatter();

    console.log('violette', documentKey);

    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey,
      },
    });

    console.log('violette', result);

    if (!result) {
      logger.warn(`Attestation pas disponible`, { identifiantProjet });
      return notFound();
    }

    return new Response(result.content, {
      headers: {
        'content-type': result.format,
      },
    });
  });
