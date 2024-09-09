import { notFound } from 'next/navigation';

import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { buildCertificate } from '@potentiel-applications/document-builder';

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

    const certificate = await buildCertificate({
      identifiantProjet,
      notifiéLe: DateTime.now().formatter(),
      notifiéPar: utilisateur.identifiantUtilisateur.email,
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
