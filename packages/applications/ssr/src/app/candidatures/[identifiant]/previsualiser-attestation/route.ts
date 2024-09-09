import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import {
  AccèsFonctionnalitéRefuséError,
  ConsulterUtilisateurQuery,
} from '@potentiel-domain/utilisateur';
import { buildCertificate } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime } from '@potentiel-domain/common';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

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

    if (Option.isNone(candidature)) {
      logger.warn(`Candidature non trouvée`, { identifiantProjet });
      return notFound();
    }

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
    });

    if (Option.isNone(appelOffres)) {
      logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });
      return notFound();
    }

    const période = appelOffres.periodes.find(
      (x) => x.id === candidature.identifiantProjet.période,
    );

    if (!période) {
      logger.warn(`Période non trouvée`, { identifiantProjet });
      return notFound();
    }

    if (période.type && période.type !== 'notified') {
      logger.warn(`Période non notifiée`, { identifiantProjet, période });
      return notFound();
    }

    const user = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (Option.isNone(user)) {
      logger.warn(`Utilisateur non trouvé`, {
        identifiantProjet,
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      });
      return notFound();
    }

    const certificate = await buildCertificate({
      appelOffre: appelOffres,
      période,
      utilisateur: user,
      candidature,
      notifiéLe: DateTime.now().formatter(),
    });

    if (!certificate) {
      return notFound();
    }

    return new Response(certificate, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'inline',
      },
    });
  });
