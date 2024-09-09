import { notFound } from 'next/navigation';

import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { generateCertificate } from '@potentiel-applications/document-builder';
import { DateTime } from '@potentiel-domain/common';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
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

    const certificate = await generateCertificate(
      identifiantProjet,
      DateTime.now().formatter(),
      utilisateur.identifiantUtilisateur.email,
    );

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
